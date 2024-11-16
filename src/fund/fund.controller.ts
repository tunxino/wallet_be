import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseBase } from '../users/base.entity';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { FundService } from './fund.service';
import { FundDto } from './fund.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  // POST route to create a new activity
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() fundDto: FundDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.fundService.create(fundDto, req.user.id);
  }
}
