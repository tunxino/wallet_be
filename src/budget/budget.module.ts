import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './bugget.service';
import { Budget, BudgetDetail } from './budget.entity';
import { BudgetsController } from './budget.controller';
import { Activity } from '../activity_user/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, BudgetDetail, Activity])],
  providers: [BudgetsService],
  controllers: [BudgetsController],
  exports: [BudgetsService],
})
export class BudgetModule {}
