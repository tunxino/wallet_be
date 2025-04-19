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
import { ResponseBase } from '../users/base.entity';
import { CronApiKeyGuard } from './cron-api-key.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('schedule')
  async scheduleNotification(
    @Body() createScheduledTaskDto: CreateScheduledTaskDto,
    @Request() req,
  ) {
    return this.taskService.scheduleNotification(
      req.user.id,
      createScheduledTaskDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async getTasks(@Request() req): Promise<ResponseBase> {
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
}
