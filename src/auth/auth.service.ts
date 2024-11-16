import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    const isValid = await this.usersService.validateUser(email, pass);
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
