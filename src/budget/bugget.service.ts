import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget, BudgetDetail } from './budget.entity';
import { CreateBudgetDto, EditBudgetDto } from './budget.dto';
import { ResponseBase } from '../users/base.entity';
import { Activity } from '../activity_user/activity.entity';
import { FilterDto } from '../activity_user/activity.dto';
import { v4 as uuidv4 } from 'uuid';

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
    userId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<ResponseBase> {
    const { amount, details } = createBudgetDto;

    const budget = new Budget();
    budget.amount = amount;
    budget.userId = userId;

    budget.details = details.map((detail) => {
      const budgetDetail = new BudgetDetail();
      budgetDetail.icon = detail.icon;
      budgetDetail.id = uuidv4();
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

  async updateBudget(
    userId: string,
    updateBudgetDto: EditBudgetDto,
  ): Promise<ResponseBase> {
    const { id, amount, details } = updateBudgetDto;
    const budget = await this.budgetRepository.findOne({
      where: { id: id, userId },
      relations: ['details'],
    });

    if (!budget) {
      return {
        message: 'Budget not found.',
        code: HttpStatus.NOT_FOUND,
      };
    }

    budget.amount = amount;

    const existingDetailsMap = new Map(budget.details.map((d) => [d.id, d]));

    const updatedDetails: BudgetDetail[] = [];

    for (const detail of details) {
      if (detail.id && existingDetailsMap.has(detail.id)) {
        // Cập nhật detail cũ
        const existing = existingDetailsMap.get(detail.id);
        existing.icon = detail.icon;
        existing.name = detail.name;
        existing.amount = detail.amount;
        updatedDetails.push(existing);
        existingDetailsMap.delete(detail.id); // đánh dấu là đã xử lý
      } else {
        // Tạo mới detail
        const newDetail = new BudgetDetail();
        newDetail.id = uuidv4();
        newDetail.icon = detail.icon;
        newDetail.name = detail.name;
        newDetail.amount = detail.amount;
        newDetail.budget = budget;
        updatedDetails.push(newDetail);
      }
    }
    const toDelete = [...existingDetailsMap.values()];
    if (toDelete.length > 0) {
      await this.budgetDetailRepository.remove(toDelete);
    }

    budget.details = updatedDetails;

    await this.budgetRepository.save(budget); // Cascade sẽ lưu detail

    return {
      message: 'Budget updated successfully.',
      code: HttpStatus.OK,
    };
  }

  async getBudgets(
    userId: string,
    filterDto: FilterDto,
  ): Promise<ResponseBase> {
    const { startDate, endDate } = filterDto;
    const type = 'DEPOSIT';

    // Khởi tạo query từ đầu để chạy song song
    const budgetPromise = this.budgetRepository.find({
      where: { userId },
      relations: ['details'],
    });

    const activityPromise = this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.category', 'category')
      .addSelect('SUM(activity.amount)', 'totalAmount')
      .addSelect('activity.icon', 'icon')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.type = :type', { type })
      .andWhere('activity.date >= :startDate', { startDate })
      .andWhere('activity.date <= :endDate', { endDate })
      .groupBy('activity.category')
      .addGroupBy('activity.icon')
      .getRawMany();

    // Thực hiện đồng thời cả 2 promise
    const [budgets, totalByCategory] = await Promise.all([
      budgetPromise,
      activityPromise,
    ]);

    if (!budgets || budgets.length === 0) {
      return {
        message: `Budget not found.`,
        code: HttpStatus.NOT_FOUND,
      };
    }

    const listResponse = await this.mergeBudgets(
      totalByCategory,
      budgets[0].details,
    );

    return {
      message: `Budget list successfully`,
      code: HttpStatus.OK,
      data: {
        id: budgets[0].id,
        amountBudgets: budgets[0].amount,
        listResponse,
      },
    };
  }

  async mergeBudgets(
    totalByCategory: { category: string; totalAmount: number; icon: string }[],
    listBudget: BudgetDetail[],
  ) {
    const budgetMap = new Map(
      totalByCategory.map((item) => [
        item.category,
        {
          totalAmount: Number(item.totalAmount), // Ensure numeric
          icon: item.icon,
        },
      ]),
    );

    return listBudget.map((item) => {
      const matched = budgetMap.get(item.name);

      return {
        category: item.name,
        icon: item.icon,
        totalAmount: matched?.totalAmount ?? 0,
        amount: item.amount,
        id: item.id,
      };
    });
  }
}
