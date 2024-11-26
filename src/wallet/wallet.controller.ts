import {
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

@UseInterceptors(LoggingInterceptor)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getWalletByUserId(@Request() req): Promise<Wallet[]> {
    return this.walletService.getWalletByUserID(req.user.id);
  }


  @Post('deleteAll')
  async deleteAll() {
    return this.walletService.deleteAll();
  }
}
