import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ResponseBase } from './base.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // Use secure connection (SSL/TLS)
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

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
    const otp = this.generateOtp();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 5);

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      otp: otp,
      otpExpires: otpExpires,
    });
    await this.usersRepository.save(newUser);
    await this.sendOtpEmail(user.email, otp);

    return {
      message: 'User created successfully',
      code: HttpStatus.CREATED,
    };
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'), // From email
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.otp === otp && user.otpExpires > new Date()) {
      user.isActive = true;
      user.otp = null;
      user.otpExpires = null;
      await this.usersRepository.save(user);
      return true;
    }

    return false;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }
}
