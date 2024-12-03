import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ResponseBase } from './base.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  ActivityCategory,
  ActivityCategoryWithdraw,
  ActivityType,
} from '../activity_user/activity.enum';
import { Category } from '../category/category.entity';
import { Wallet } from '../wallet/wallet.entity';
import { WalletType } from '../wallet/wallet.enum';
import { OAuth2Client } from 'google-auth-library';
import { SocialLoginDto } from './users.dto';
import { AuthService } from '../auth/auth.service';
import { generatePassword } from '../Utils/string.utils';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async createWithGoogle(
    socialLoginDto: SocialLoginDto,
  ): Promise<ResponseBase> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: socialLoginDto.token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (payload.email !== socialLoginDto.email) {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }
      const user = await this.findOne(socialLoginDto.email);
      if (user != null) {
        return await this.authService.signInGoogle(user);
      } else {
        const newUser = await this.createBySocial(payload.email, payload.name);
        return await this.authService.signInGoogle(newUser);
      }
    } catch (error) {
      console.error('error.............', error);
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async createWithFacebook(
    socialLoginDto: SocialLoginDto,
  ): Promise<ResponseBase> {
    try {
      const user = await this.findOne(socialLoginDto.email);
      if (user != null) {
        return await this.authService.signInGoogle(user);
      } else {
        const newUser = await this.createBySocial(
          socialLoginDto.email,
          socialLoginDto.name,
        );
        return await this.authService.signInGoogle(newUser);
      }
    } catch (error) {
      console.log('error.............', error);
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async createBySocial(email: string, name: string): Promise<User> {
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      name: name,
      email: email,
      password: hashedPassword,
      isActive: true,
    });
    await this.usersRepository.save(newUser);

    const depositCategories = Object.values(ActivityCategory).map(
      (category) => ({
        userId: newUser.id,
        category: category,
        type: ActivityType.DEPOSIT,
        title: category,
        icon: `${category.toLowerCase()}.png`,
      }),
    );

    const withdrawCategories = Object.values(ActivityCategoryWithdraw).map(
      (category) => ({
        userId: newUser.id,
        category: category,
        type: ActivityType.WITHDRAWAL,
        title: category,
        icon: `${category.toLowerCase()}.png`,
      }),
    );
    const allCategories = [...depositCategories, ...withdrawCategories];
    const categories = this.categoryRepository.create(allCategories);
    await this.categoryRepository.save(categories);

    // create wallet
    const walletAccount = this.walletRepository.create({
      userId: newUser.id,
      accountName: newUser.name,
      type: WalletType.BANK,
      isDefault: true,
      currency: 'VND',
      icon: 'BANK',
      amount: 0,
    });
    await this.walletRepository.save(walletAccount);

    return newUser;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async delete() {
    return this.usersRepository.delete({});
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByID(id: number): Promise<ResponseBase> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const categories = await this.categoryRepository.find({
      where: { userId: id },
    });
    const wallets = await this.walletRepository.find({
      where: { userId: id },
    });
    wallets.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.isActive,
        wallets: wallets,
        categories: categories,
      },
    };
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
    // create category
    const depositCategories = Object.values(ActivityCategory).map(
      (category) => ({
        userId: newUser.id,
        category: category,
        type: ActivityType.DEPOSIT,
        title: category,
        icon: `${category.toLowerCase()}.png`,
      }),
    );

    const withdrawCategories = Object.values(ActivityCategoryWithdraw).map(
      (category) => ({
        userId: newUser.id,
        category: category,
        type: ActivityType.WITHDRAWAL,
        title: category,
        icon: `${category.toLowerCase()}.png`,
      }),
    );
    const allCategories = [...depositCategories, ...withdrawCategories];
    const categories = this.categoryRepository.create(allCategories);
    await this.categoryRepository.save(categories);

    // create wallet
    const walletAccount = this.walletRepository.create({
      userId: newUser.id,
      accountName: newUser.name,
      type: WalletType.BANK,
      isDefault: true,
      currency: 'vnd',
      icon: 'BANK',
      amount: 0,
    });
    await this.walletRepository.save(walletAccount);

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
