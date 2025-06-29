import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.sevice';
import { GroupController } from './group.controller';
import { Expense, ExpenseShare, Group, GroupMember } from './group.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMember, User, Expense, ExpenseShare]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupModule {}
