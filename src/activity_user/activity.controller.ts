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
  UpdateActivityDto,
} from './activity.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseBase } from '../users/base.entity';
import { LoggingInterceptor } from '../common/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // POST route to create a new activity
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Request() req,
  ): Promise<ResponseBase> {
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
