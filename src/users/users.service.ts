import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ResponseBase } from './base.entity';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findOneByID(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<ResponseBase> {
    const userOld = await this.findOne(user.email);
    if (userOld) {
      return {
        message: 'email are required.',
        code: HttpStatus.BAD_REQUEST,
      };
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);
    return {
      message: 'User created successfully',
      code: HttpStatus.CREATED,
    };
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
