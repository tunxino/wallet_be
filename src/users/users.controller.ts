import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ResponseBase, VerifyOtpDto } from './base.entity';
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

  @Post('verifyOTP')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const isVerified = await this.usersService.verifyOtp(email, otp);
    if (isVerified) {
      return {
        message: 'OTP verified successfully, login complete',
        code: HttpStatus.OK,
      };
    }
    return { message: 'Invalid or expired OTP', code: HttpStatus.NOT_FOUND };
  }
}
