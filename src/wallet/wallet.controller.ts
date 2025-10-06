import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
// import { LoggingInterceptor } from '../common/logging.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { AuthenticatedRequest, ResponseBase } from '../users/base.entity';
import { WalletDto, WalletEditDto } from './wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getWalletByUserId(
    @Request() req: AuthenticatedRequest,
  ): Promise<Wallet[]> {
    return this.walletService.getWalletByUserID(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createWallet(
    @Body() walletDto: WalletDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ResponseBase> {
    return this.walletService.createWallet(req.user.id, walletDto);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateWallet(
    @Body() walletEditDto: WalletEditDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ResponseBase> {
    return this.walletService.updateWallet(walletEditDto, req.user.id);
  }

  @Post('deleteAll')
  async deleteAll() {
    return this.walletService.deleteAll();
  }
}
