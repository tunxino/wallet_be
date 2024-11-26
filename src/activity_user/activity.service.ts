import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import {
  CreateActivityDto,
  GetActivitiesByDateRangeDto,
  GetActivitiesChartDateRangeDto,
  UpdateActivityDto,
} from './activity.dto';
import { ResponseBase } from '../users/base.entity';
import { ActivityType } from './activity.enum';
import { format } from 'date-fns';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: number,
  ): Promise<ResponseBase> {
    const { category, amount, type, date, note, icon, walletId, imageUrl } =
      createActivityDto;

    const wallet = await this.walletRepository.findOneBy({
      id: walletId,
    });
    const walletType = wallet.type;

    if (type === ActivityType.WITHDRAWAL) {
      wallet.amount = Number(wallet.amount) + Number(amount);
    } else {
      if (wallet.amount - amount < 0) {
        return {
          message: 'Wallet does not have enough money!',
          code: HttpStatus.NOT_FOUND,
        };
      } else {
        wallet.amount = Number(wallet.amount) - Number(amount);
      }
    }

    const newActivity = this.activityRepository.create({
      amount,
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

    await this.walletRepository.save(wallet);
    await this.activityRepository.save(newActivity);
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
    if (updateActivityDto.type) {
      activity.type = updateActivityDto.type;
    }
    if (updateActivityDto.category) {
      activity.category = updateActivityDto.category;
    }
    if (updateActivityDto.amount) {
      activity.amount = updateActivityDto.amount;
    }

    await this.activityRepository.save(activity);
    return {
      message: 'User edited successfully',
      code: HttpStatus.CREATED,
    };
  }

  async deleteAll() {
    return this.activityRepository.delete({});
  }

  async delete(id: string): Promise<ResponseBase> {
    // Try to find the activity by ID
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
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
    let totalDepositResult: number = 0;
    let totalWithdrawResult: number = 0;
    // Build the query
    const query = this.activityRepository.createQueryBuilder('activity');

    if (userId) {
      query.andWhere('activity.userId = :userId', { userId });
    }
    if (startDate) {
      query.andWhere('activity.date >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('activity.date <= :endDate', { endDate });
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

    // Build the query
    const query = this.activityRepository.createQueryBuilder('activity');

    if (userId) {
      query.andWhere('activity.userId = :userId', { userId });
    }

    if (startDate) {
      query.andWhere('activity.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('activity.date <= :endDate', { endDate });
    }

    if (type) {
      query.andWhere(`activity.type = :type`, { type });
    }

    const activities = await query.getMany();
    const totalByCategory = await query
      .select('activity.category', 'category')
      .addSelect('SUM(activity.amount)', 'totalAmount')
      .addSelect('activity.icon', 'icon') // Select the icon
      .groupBy('activity.category')
      .addGroupBy('activity.icon')
      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalDepositResult: number = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalWithdrawResult: number = 0;

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
