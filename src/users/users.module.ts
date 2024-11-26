import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Category } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { Wallet } from "../wallet/wallet.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Wallet]),
    forwardRef(() => AuthModule),
    forwardRef(() => CategoryModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
