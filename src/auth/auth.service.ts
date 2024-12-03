import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseBase } from '../users/base.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
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

  async signInGoogle(user: User): Promise<ResponseBase> {
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
