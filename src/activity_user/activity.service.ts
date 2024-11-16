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

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: number,
  ): Promise<ResponseBase> {
    const { category, amount, type, date, note } = createActivityDto;

    // Create a new activity entity with the provided data
    const newActivity = this.activityRepository.create({
      amount,
      type,
      date,
      category,
      userId,
      note,
    });

    // Save the new activity entity to the database
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
    const activities = await query.getMany();

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

    const dailyTotalsQuery =
      this.activityRepository.createQueryBuilder('activity');

    dailyTotalsQuery
      .select([
        'DATE(activity.date) AS day', // Group by day
        'SUM(CASE WHEN activity.type = :deposit THEN activity.amount ELSE 0 END) AS totalDepositAmount',
        'SUM(CASE WHEN activity.type = :withdrawal THEN activity.amount ELSE 0 END) AS totalWithdrawalAmount',
      ])
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.date >= :startDate', { startDate })
      .andWhere('activity.date <= :endDate', { endDate })
      .groupBy('day') // Group by day
      .orderBy('day', 'DESC')
      .setParameters({
        deposit: 'DEPOSIT',
        withdrawal: 'WITHDRAWAL',
      });

    const dailyTotals = await dailyTotalsQuery.getRawMany();

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        activities,
        dailyTotals,
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

    const categoryQuery =
      this.activityRepository.createQueryBuilder('activity');

    // Apply the same filters to the total amount query
    if (userId) {
      categoryQuery.andWhere('activity.userId = :userId', { userId });
    }
    if (startDate) {
      categoryQuery.andWhere('activity.date >= :startDate', { startDate });
    }
    if (endDate) {
      categoryQuery.andWhere('activity.date <= :endDate', { endDate });
    }

    categoryQuery.andWhere(`activity.type = :type`, { type });

    const totalByCategory = await categoryQuery
      .select('activity.category', 'category')
      .addSelect('SUM(activity.amount)', 'totalAmount')
      .groupBy('activity.category')
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

  async getAll(id: number): Promise<Activity[]> {
    return this.activityRepository.findBy({ userId: id });
  }
}
