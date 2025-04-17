import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget, BudgetDetail } from './budget.entity';
import { CreateBudgetDto, EditBudgetDto } from './budget.dto';
import { ResponseBase } from '../users/base.entity';
import { Activity } from '../activity_user/activity.entity';
import { FilterDto } from '../activity_user/activity.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetDetail)
    private budgetDetailRepository: Repository<BudgetDetail>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async createBudget(
    userId: number,
    createBudgetDto: CreateBudgetDto,
  ): Promise<ResponseBase> {
    const { amount, details } = createBudgetDto;

    const budget = new Budget();
    budget.amount = amount;
    budget.userId = userId;

    budget.details = details.map((detail) => {
      const budgetDetail = new BudgetDetail();
      budgetDetail.icon = detail.icon;
      budgetDetail.amount = detail.amount;
      budgetDetail.name = detail.name;
      budgetDetail.budget = budget;
      return budgetDetail;
    });

    await this.budgetRepository.save(budget);
    await this.budgetDetailRepository.save(budget.details);
    return {
      message: `Budget created successfully.`,
      code: HttpStatus.CREATED,
    };
  }

  async editBudgetById(editBudgetDto: EditBudgetDto): Promise<ResponseBase> {
    const { id, amount, details } = editBudgetDto;

    const budget = await this.budgetRepository.findOneBy({ id: id });

    budget.amount = amount;

    budget.details = details.map((detail) => {
      const budgetDetail = new BudgetDetail();
      budgetDetail.icon = detail.icon;
      budgetDetail.amount = detail.amount;
      budgetDetail.name = detail.name;
      budgetDetail.budget = budget;
      return budgetDetail;
    });

    await this.budgetRepository.save(budget);
    await this.budgetDetailRepository.save(budget.details);

    return {
      message: `Budget created successfully.`,
      code: HttpStatus.OK,
    };
  }

  async getBudgets(
    userId: number,
    filterDto: FilterDto,
  ): Promise<ResponseBase> {
    const budgets = await this.budgetRepository.find({
      where: { userId },
      relations: ['details'],
    });

    if (!budgets || budgets.length === 0) {
      return {
        message: `Budget not found.`,
        code: HttpStatus.NOT_FOUND,
      };
    }

    const { startDate, endDate } = filterDto;
    const type = 'DEPOSIT';

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
    const totalByCategory = await query
      .select('activity.category', 'category')
      .addSelect('SUM(activity.amount)', 'totalAmount')
      .addSelect('activity.icon', 'icon')
      .groupBy('activity.category')
      .addGroupBy('activity.icon')
      .getRawMany();

    const listResponse = await this.mergeBudgets(
      totalByCategory,
      budgets[0].details,
    );
    return {
      message: `Budget list successfully`,
      code: HttpStatus.OK,
      data: {
        amountBudgets: budgets[0].amount,
        listResponse,
      },
    };
  }

  async mergeBudgets(totalByCategory: any[], listBudget: BudgetDetail[]) {
    const budgetMap = new Map(
      totalByCategory.map((item) => [item.category, item]),
    );

    const mergedResult = listBudget.map((item) => {
      const matchingBudget = budgetMap.get(item.name);

      if (matchingBudget) {
        return {
          category: item.name,
          icon: item.icon,
          totalAmount: matchingBudget.totalAmount,
          amount: item.amount, // The amount from listBudget
        };
      }
      return {
        category: item.name,
        icon: item.icon,
        totalAmount: 0,
        amount: item.amount, // Or any default value
      };
    });

    return mergedResult;
  }
}
