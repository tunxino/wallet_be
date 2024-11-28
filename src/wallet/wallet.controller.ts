import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { ResponseBase } from '../users/base.entity';
import { WalletDto, WalletEditDto } from './wallet.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getWalletByUserId(@Request() req): Promise<Wallet[]> {
    return this.walletService.getWalletByUserID(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createWallet(
    @Body() walletDto: WalletDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.walletService.createWallet(req.user.id, walletDto);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateWallet(
    @Body() walletEditDto: WalletEditDto,
  ): Promise<ResponseBase> {
    return this.walletService.updateWallet(walletEditDto);
  }

  @Post('deleteAll')
  async deleteAll() {
    return this.walletService.deleteAll();
  }
}
