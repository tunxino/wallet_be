import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ResponseBase } from '../users/base.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>): Promise<ResponseBase> {
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.tokenFCM,
    );
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  getProfile(@Request() req): Promise<ResponseBase> {
    return req.user;
  }
}
