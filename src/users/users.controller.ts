import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ResponseBase } from './base.entity';
import { LoggingInterceptor } from '../common/logging.interceptor';

@UseInterceptors(new LoggingInterceptor())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneByID(id);
  }

  @Post('register')
  create(@Body() user: Partial<User>): Promise<ResponseBase> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
