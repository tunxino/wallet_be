import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseBase } from '../users/base.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<ResponseBase> {
    const user = await this.usersService.findOne(email);
    const isValid = await this.usersService.validatePassword(email, pass);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      name: user.name,
      username: user.email,
      isActive: user.isActive,
    };

    return {
      message: 'login successfully',
      code: HttpStatus.OK,
      data: {
        accessToken: await this.jwtService.signAsync(payload),
      },
    };
  }
}
