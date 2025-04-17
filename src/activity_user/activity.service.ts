import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: number,
  ): Promise<ResponseBase> {
    const { category, amount, type, date, note, icon, walletId, imageUrl } =
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
      date,
      category,
      userId,
      note,
      icon,
      walletId,
      walletType,
      imageUrl,
    });

    await Promise.all([
      this.walletRepository.save(wallet),
      this.activityRepository.save(newActivity),
    ]);

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

  // async deleteAll() {
  //   return this.activityRepository.delete({});
  // }

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

    await Promise.all([
      await this.walletRepository.save(wallet),
      await this.activityRepository.remove(activity),
    ]);

    return {
      message: 'User delete successfully',
      code: HttpStatus.CREATED,
    };
  }

  async getActivitiesByDateRange(
    filterDto: GetActivitiesByDateRangeDto,
    userId: number,
  ): Promise<ResponseBase> {
    const { startDate, endDate } = filterDto;

    const [activities, totalsByType, dailyTotals, monthlyTotals] =
      await Promise.all([
        this.activityRepository.find({
          where: {
            userId,
            date: Between(new Date(startDate), new Date(endDate)),
          },
          order: { date: 'DESC' },
        }),
        this.activityRepository
          .createQueryBuilder('activity')
          .select('activity.type', 'type')
          .addSelect('SUM(activity.amount)', 'total')
          .where('activity.userId = :userId', { userId })
          .andWhere('activity.date BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .groupBy('activity.type')
          .getRawMany(),
        this.activityRepository
          .createQueryBuilder('activity')
          .select("TO_CHAR(activity.date, 'YYYY-MM-DD')", 'day')
          .addSelect(
            `SUM(CASE WHEN activity.type = 'DEPOSIT' THEN activity.amount ELSE 0 END)`,
            'totaldepositamount',
          )
          .addSelect(
            `SUM(CASE WHEN activity.type = 'WITHDRAWAL' THEN activity.amount ELSE 0 END)`,
            'totalwithdrawalamount',
          )
          .where('activity.userId = :userId', { userId })
          .andWhere('activity.date BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .groupBy('day')
          .orderBy('day', 'DESC')
          .getRawMany(),
        this.activityRepository
          .createQueryBuilder('activity')
          .select("TO_CHAR(activity.date, 'YYYY-MM')", 'day') // <--- đổi alias ở đây
          .addSelect(
            `SUM(CASE WHEN activity.type = 'DEPOSIT' THEN activity.amount ELSE 0 END)`,
            'totaldepositamount',
          )
          .addSelect(
            `SUM(CASE WHEN activity.type = 'WITHDRAWAL' THEN activity.amount ELSE 0 END)`,
            'totalwithdrawalamount',
          )
          .where('activity.userId = :userId', { userId })
          .andWhere('activity.date BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .groupBy('day')
          .orderBy('day', 'DESC')
          .getRawMany(),
      ]);

    const totalDepositResult = Number(
      totalsByType.find((t) => t.type === 'DEPOSIT')?.total || 0,
    );
    const totalWithdrawResult = Number(
      totalsByType.find((t) => t.type === 'WITHDRAWAL')?.total || 0,
    );

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
    userId: number,
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
    userId: number,
    walletId: string,
  ): Promise<ResponseBase> {
    const query = await this.activityRepository.find({
      where: { userId, walletId },
      order: { date: 'DESC' },
    });

    const activities = Object.values(query);

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        activities,
      },
    };
  }

  async getAll(id: number): Promise<Activity[]> {
    return this.activityRepository.findBy({ userId: id });
  }
}
