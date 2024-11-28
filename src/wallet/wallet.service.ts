import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { ResponseBase } from '../users/base.entity';
import { WalletDto } from './wallet.dto';

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
    await this.walletRepository.save(walletAccount);
    return {
      message: 'Create wallet successfully',
      code: HttpStatus.CREATED,
    };
  }

  async deleteAll() {
    return this.walletRepository.delete({});
  }
}
