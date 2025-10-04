import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Activity } from './activity.entity';
import {
  CreateActivityDto,
  GetActivitiesByDateRangeDto,
  GetActivitiesChartDateRangeDto,
  UpdateActivityDto,
} from './activity.dto';
import { ResponseBase } from '../users/base.entity';
import { ActivityType } from './activity.enum';
import { Wallet } from '../wallet/wallet.entity';
import { User } from '../users/user.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { format } from 'date-fns';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: string,
  ): Promise<ResponseBase> {
    const { category, amount, type, note, icon, walletId, imageUrl } =
      createActivityDto;
    const amountNumber = Math.floor(Number(amount));
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      select: ['id', 'type', 'amount'],
    });
    const walletType = wallet.type;

    if (type === ActivityType.WITHDRAWAL) {
      wallet.amount = Number(wallet.amount) + amountNumber;
    } else {
      if (wallet.amount - amountNumber < 0) {
        return {
          message: 'Wallet does not have enough money!',
          code: HttpStatus.NOT_FOUND,
        };
      } else {
        wallet.amount = Number(wallet.amount) - amountNumber;
      }
    }

    const newActivity = this.activityRepository.create({
      amount: amountNumber,
      type,
      category,
      userId,
      note,
      icon,
      walletId,
      walletType,
      imageUrl,
    });

    await this.walletRepository.save(wallet);
    await this.activityRepository.save(newActivity);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'tokenFCM'],
    });

    if (user?.tokenFCM) {
      this.firebaseService
        .sendNotification(
          user.tokenFCM,
          'New activity created',
          `${type === 'WITHDRAWAL' ? 'Withdrawed' : 'Deposited'} $${amountNumber}`,
          {
            activityId: newActivity.id.toString(),
            amount: amountNumber.toString(),
          },
        )
        .catch((err) => {
          console.log('FCM notification failed:', err.message);
        });
    }

    return {
      message: 'User created successfully',
      code: HttpStatus.CREATED,
    };
  }

  async update(updateActivityDto: UpdateActivityDto): Promise<ResponseBase> {
    // Find the activity by ID
    const activity = await this.activityRepository.findOneBy({
      id: updateActivityDto.id,
    });
    if (!activity) {
      throw new NotFoundException(
        `Activity with ID ${updateActivityDto.id} not found`,
      );
    }

    const wallet = await this.walletRepository.findOneBy({
      id: activity.walletId,
    });
    if (updateActivityDto.category) {
      activity.category = updateActivityDto.category;
    }
    if (updateActivityDto.amount) {
      if (activity.type === ActivityType.WITHDRAWAL) {
        wallet.amount = wallet.amount - Number(activity.amount);
      } else {
        wallet.amount = wallet.amount + Number(activity.amount);
      }
      if (updateActivityDto.type === ActivityType.WITHDRAWAL) {
        wallet.amount = wallet.amount + Number(updateActivityDto.amount);
      } else {
        wallet.amount = wallet.amount - Number(updateActivityDto.amount);
      }
      activity.amount = updateActivityDto.amount;
    }
    if (updateActivityDto.type) {
      activity.type = updateActivityDto.type;
    }
    if (updateActivityDto.date) {
      activity.date = updateActivityDto.date;
    }
    if (updateActivityDto.note) {
      activity.note = updateActivityDto.note;
    }
    if (wallet.amount < 0) {
      return {
        message: 'Total amount not enough money!',
        code: HttpStatus.BAD_REQUEST,
      };
    }
    await this.walletRepository.save(wallet);
    await this.activityRepository.save(activity);
    return {
      message: 'User edited successfully',
      code: HttpStatus.CREATED,
    };
  }

  async delete(id: string): Promise<ResponseBase> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      select: ['id', 'amount', 'type', 'walletId'],
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: activity.walletId },
      select: ['id', 'amount'],
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet with ID ${activity.walletId} not found`,
      );
    }

    if (activity.type === ActivityType.WITHDRAWAL) {
      wallet.amount -= activity.amount;
    } else {
      wallet.amount += activity.amount;
    }
    await this.walletRepository.save(wallet);
    await this.activityRepository.remove(activity);
    return {
      message: 'User delete successfully',
      code: HttpStatus.CREATED,
    };
  }

  async getActivitiesByDateRange(
    filterDto: GetActivitiesByDateRangeDto,
    userId: string,
  ): Promise<ResponseBase> {
    const { startDate, endDate } = filterDto;
    const s = new Date(startDate);
    const e = new Date(endDate);
    s.setHours(0, 0, 0, 0);
    e.setHours(23, 59, 59, 999);
    let totalDepositResult: number = 0;
    let totalWithdrawResult: number = 0;
    // Build the query
    const query = this.activityRepository.createQueryBuilder('activity');

    if (userId) {
      query.andWhere('activity.userId = :userId', { userId });
    }
    if (startDate) {
      query.andWhere('activity.date >= :startDate', {
        startDate: s.toLocaleString('sv-SE').replace(' ', 'T'),
      });
    }
    if (endDate) {
      query.andWhere('activity.date <= :endDate', {
        endDate: e.toLocaleString('sv-SE').replace(' ', 'T'),
      });
    }
    query.orderBy('activity.date', 'DESC');
    const activitiesRaw = await query.getMany();
    const activities = activitiesRaw.map((activity) => {
      const formattedDate = format(activity.date, 'yyyy-MM-dd');
      return {
        ...activity,
        date: formattedDate,
      };
    });
    activities
      .filter((item) => item.type === ActivityType.DEPOSIT)
      .forEach((item) => {
        totalDepositResult += item.amount;
      });

    activities
      .filter((item) => item.type === ActivityType.WITHDRAWAL)
      .forEach((item) => {
        totalWithdrawResult += item.amount;
      });

    const dailyTotalsArray = activities.reduce((acc, activity) => {
      const day = activity.date;
      if (!acc[day]) {
        acc[day] = {
          day: day,
          totaldepositamount: 0,
          totalwithdrawalamount: 0,
        };
      }
      if (activity.type === 'DEPOSIT') {
        acc[day].totaldepositamount += activity.amount;
      } else if (activity.type === 'WITHDRAWAL') {
        acc[day].totalwithdrawalamount += activity.amount;
      }

      return acc.valueOf();
    }, {});
    const dailyTotals = Object.values(dailyTotalsArray);

    const monthlyTotalsArray = activities.reduce((acc, activity) => {
      const month = format(new Date(activity.date), 'yyyy-MM'); // Format to get the month as "yyyy-MM"
      if (!acc[month]) {
        acc[month] = {
          day: month,
          totaldepositamount: 0,
          totalwithdrawalamount: 0,
        };
      }
      if (activity.type === 'DEPOSIT') {
        acc[month].totaldepositamount += activity.amount;
      } else if (activity.type === 'WITHDRAWAL') {
        acc[month].totalwithdrawalamount += activity.amount;
      }

      return acc;
    }, {});

    const monthlyTotals = Object.values(monthlyTotalsArray);

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        activities,
        dailyTotals,
        monthlyTotals,
        totalDepositResult,
        totalWithdrawResult,
      },
    };
  }

  async getActivitiesChartDateRange(
    filterDto: GetActivitiesChartDateRangeDto,
    userId: string,
  ): Promise<ResponseBase> {
    const { startDate, endDate, type } = filterDto;
    const baseQuery = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId });

    if (startDate) {
      baseQuery.andWhere('activity.date >= :startDate', { startDate });
    }

    if (endDate) {
      baseQuery.andWhere('activity.date <= :endDate', { endDate });
    }

    if (type) {
      baseQuery.andWhere('activity.type = :type', { type });
    }

    const activities = await baseQuery.getMany();
    let totalDepositResult = 0;
    let totalWithdrawResult = 0;
    const totalByCategoryMap: Record<
      string,
      { totalAmount: number; icon: string }
    > = {};

    for (const activity of activities) {
      if (activity.type === ActivityType.DEPOSIT) {
        totalDepositResult += activity.amount;
      } else if (activity.type === ActivityType.WITHDRAWAL) {
        totalWithdrawResult += activity.amount;
      }

      if (!totalByCategoryMap[activity.category]) {
        totalByCategoryMap[activity.category] = {
          totalAmount: 0,
          icon: activity.icon,
        };
      }
      totalByCategoryMap[activity.category].totalAmount += activity.amount;
    }

    // --- Format lại category totals ---
    const totalByCategory = Object.entries(totalByCategoryMap).map(
      ([category, data]) => ({
        category,
        totalAmount: data.totalAmount,
        icon: data.icon,
      }),
    );

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        activities,
        totalDepositResult,
        totalWithdrawResult,
        totalByCategory,
      },
    };
  }

  async getActivitiesByUserAndWallet(
    userId: string,
    walletId: string,
  ): Promise<ResponseBase> {
    const query = await this.activityRepository.find({
      where: { userId, walletId },
      order: { date: 'DESC' },
    });
    // const formattedDate = format(activity.date, 'yyyy-MM-dd');

    // const activities = Object.values(query);
    const activities = query.map((activity) => ({
      ...activity,
      date: format(new Date(activity.date), 'yyyy-MM-dd'),
    }));

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        activities,
      },
    };
  }

  async getAll(id: string): Promise<Activity[]> {
    return this.activityRepository.findBy({ userId: id });
  }
}
