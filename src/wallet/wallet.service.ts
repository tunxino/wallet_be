import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { ResponseBase } from '../users/base.entity';
import { WalletDto, WalletEditDto } from './wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getWalletByUserID(userId: number): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { userId: userId } });
  }

  async createWallet(
    userId: number,
    walletDto: WalletDto,
  ): Promise<ResponseBase> {
    const walletAccount = this.walletRepository.create({
      userId: userId,
      accountName: walletDto.accountName,
      type: walletDto.type,
      isDefault: walletDto.isDefault,
      currency: walletDto.currency,
      icon: walletDto.type,
      amount: 0,
    });

    if (walletDto.isDefault === true) {
      const walletUser = await this.walletRepository.find({
        where: { userId: userId },
      });
      walletUser.forEach((item) => {
        item.isDefault = false;
      });
      await this.walletRepository.save(walletUser);
    }

    await this.walletRepository.save(walletAccount);
    return {
      message: 'Create wallet successfully',
      code: HttpStatus.CREATED,
    };
  }

  async updateWallet(
    walletEditDto: WalletEditDto,
    userId: number,
  ): Promise<ResponseBase> {
    const wallet = await this.walletRepository.findOneBy({
      id: walletEditDto.id,
    });
    if (!wallet) {
      throw new NotFoundException(
        `Wallet with ID ${walletEditDto.id} not found`,
      );
    }

    if (walletEditDto.accountName) {
      wallet.accountName = walletEditDto.accountName;
    }
    if (walletEditDto.type) {
      wallet.type = walletEditDto.type;
    }
    if (walletEditDto.currency) {
      wallet.currency = walletEditDto.currency;
    }
    if (walletEditDto.isDefault !== null) {
      wallet.isDefault = walletEditDto.isDefault;
      if (walletEditDto.isDefault === true) {
        const walletUser = await this.walletRepository.find({
          where: { userId: userId },
        });
        walletUser.forEach((item) => {
          item.isDefault = false;
        });
        await this.walletRepository.save(walletUser);
      }
    }
    await this.walletRepository.save(wallet);
    return {
      message: 'Create wallet successfully',
      code: HttpStatus.CREATED,
    };
  }

  async deleteAll() {
    return this.walletRepository.delete({});
  }
}
