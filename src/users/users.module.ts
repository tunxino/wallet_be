import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Category } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { Wallet } from "../wallet/wallet.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Wallet]),
    forwardRef(() => CategoryModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
