import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BudgetsService } from './bugget.service';

import { CreateBudgetDto, EditBudgetDto } from './budget.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseBase } from '../users/base.entity';
import { FilterDto } from '../activity_user/activity.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBudget(
    @Body()
    createBudgetDto: CreateBudgetDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.budgetsService.createBudget(req.user.id, createBudgetDto);
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async editBudget(
    @Body()
    editBudgetDto: EditBudgetDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.budgetsService.updateBudget(req.user.id, editBudgetDto);
  }

  @UseGuards(AuthGuard)
  @Post('getBudgets')
  async getAllBudgets(
    @Body() filterDto: FilterDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.budgetsService.getBudgets(req.user.id, filterDto);
  }
}
