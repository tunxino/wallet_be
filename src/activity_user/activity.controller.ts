import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import {
  CreateActivityDto,
  DeleteActivityDto,
  GetActivitiesByDateRangeDto,
  GetActivitiesChartDateRangeDto,
  GetWalletActivityDto,
  UpdateActivityDto,
} from './activity.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseBase } from '../users/base.entity';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';

@UseInterceptors(LoggingInterceptor)
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly firebaseService: FirebaseService,
  ) {}

  // POST route to create a new activity
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ): Promise<ResponseBase> {
    if (image) {
      const imageUrl = await this.firebaseService.uploadFile(image);
      createActivityDto.imageUrl = imageUrl;
    }
    return this.activityService.create(createActivityDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async update(
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<ResponseBase> {
    return this.activityService.update(updateActivityDto);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async delete(
    @Body() deleteActivityDto: DeleteActivityDto,
  ): Promise<ResponseBase> {
    return this.activityService.delete(deleteActivityDto.id);
  }

  @Post('deleteAll')
  async deleteAll() {
    return this.activityService.deleteAll();
  }

  @UseGuards(AuthGuard)
  @Post('getActivityByWalletId')
  async getActivityByWalletId(
    @Body() getWalletActivityDto: GetWalletActivityDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.activityService.getActivitiesByUserAndWallet(
      req.user.id,
      getWalletActivityDto.walletId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('getActivity')
  async getActivitiesByDateRange(
    @Body() filterDto: GetActivitiesByDateRangeDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.activityService.getActivitiesByDateRange(
      filterDto,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Post('getByType')
  async getByType(
    @Body() filterDto: GetActivitiesChartDateRangeDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.activityService.getActivitiesChartDateRange(
      filterDto,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    return this.activityService.getAll(req.user.id);
  }
}
