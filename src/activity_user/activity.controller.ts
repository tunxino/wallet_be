import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
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
import { SupabaseService } from '../supabase/supabase.service';
import {
  FileFieldsInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFiles() files: Record<string, UploadedFile[]>,
    @Request() req,
  ): Promise<ResponseBase> {
    const file = files?.image?.[0];

    if (file) {
      const imageUrl = await this.supabaseService.uploadFile({
        buffer: file.buffer,
        originalname: `${Date.now()}_image.png`,
        mimetype: file.mimetype,
      } as Express.Multer.File);

      createActivityDto.imageUrl = imageUrl;
    } else {
      createActivityDto.imageUrl = '';
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

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  fieldname: string;
  size: number;
}
