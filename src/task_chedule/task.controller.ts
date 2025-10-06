import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateScheduledTaskDto, DeleteScheduledTaskDto } from './tast.dto';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest, ResponseBase } from '../users/base.entity';
import { CronApiKeyGuard } from './cron-api-key.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('schedule')
  async scheduleNotification(
    @Body() createScheduledTaskDto: CreateScheduledTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.scheduleNotification(
      req.user.id,
      createScheduledTaskDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async getTasks(@Request() req: AuthenticatedRequest): Promise<ResponseBase> {
    return this.taskService.getTasks(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteTasks(
    @Body() deleteScheduledTaskDto: DeleteScheduledTaskDto,
  ): Promise<ResponseBase> {
    return this.taskService.deleteTasks(deleteScheduledTaskDto.id);
  }

  @UseGuards(CronApiKeyGuard)
  @Get('cron')
  async runScheduledJobManually() {
    await this.taskService.handleScheduledNotifications();
    return { success: true };
  }

  @Get()
  async executeCronJob() {
    await this.taskService.performScheduledTask();
    return { success: true, message: 'Cron job executed successfully' };
  }
}
