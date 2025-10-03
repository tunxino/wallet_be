import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ResponseBase, successResponse, VerifyOtpDto } from './base.entity';
import { AuthGuard } from '../auth/auth.guard';
import { SocialLoginDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('getProfile')
  @HttpCode(HttpStatus.OK)
  findOne(@Request() req): Promise<ResponseBase> {
    return this.usersService.findOneByID(req.user.id);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  create(@Body() user: Partial<User>): Promise<ResponseBase> {
    return this.usersService.create(user);
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  delete() {
    return this.usersService.delete();
  }

  @Post('register/google')
  @HttpCode(HttpStatus.OK)
  async createWithGoogle(
    @Body() socialLoginDto: SocialLoginDto,
  ): Promise<ResponseBase> {
    return this.usersService.createWithGoogle(socialLoginDto);
  }

  @Post('register/facebook')
  @HttpCode(HttpStatus.OK)
  async createWithFacebook(
    @Body() socialLoginDto: SocialLoginDto,
  ): Promise<ResponseBase> {
    return this.usersService.createWithFacebook(socialLoginDto);
  }

  @Post('verifyOTP')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const isVerified = await this.usersService.verifyOtp(email, otp);
    if (isVerified) {
      return successResponse();
    }
    return { message: 'Invalid or expired OTP', code: HttpStatus.NOT_FOUND };
  }
}
