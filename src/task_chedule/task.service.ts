import { HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';

import { RepeatType, Task } from './task.entity';
import { CreateScheduledTaskDto } from './tast.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../users/users.service';
import { ResponseBase } from '../users/base.entity'; // bạn sẽ tạo sau

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async getTasks(userId: string): Promise<ResponseBase> {
    const tasks = await this.taskRepository.find({
      where: { userId },
      order: { scheduledAt: 'DESC' },
    });

    return {
      message: 'successfully',
      code: HttpStatus.OK,
      data: tasks,
    };
  }

  async deleteTasks(id: string): Promise<ResponseBase> {
    await this.taskRepository.delete(id);

    return {
      message: 'successfully',
      code: HttpStatus.OK,
    };
  }

  async scheduleNotification(
    userId: string,
    createScheduledTaskDto: CreateScheduledTaskDto,
  ) {
    const notification = this.taskRepository.create({
      userId: userId,
      title: createScheduledTaskDto.title,
      body: createScheduledTaskDto.body,
      scheduledAt: createScheduledTaskDto.scheduledAt,
      repeat: createScheduledTaskDto.repeat,
    });
    return await this.taskRepository.save(notification);
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledNotifications() {
    const now = new Date();

    const notifications = await this.taskRepository.find({
      where: {
        scheduledAt: LessThanOrEqual(now),
        sent: false,
        processing: false,
      },
    });

    if (!notifications.length) return;

    // const userIds = [...new Set(notifications.map((n) => n.userId))];
    // const usersMap = new Map(
    //   (await this.usersService.getManyByIds(userIds)).map((user) => [
    //     user.id,
    //     user,
    //   ]),
    // );

    const toUpdate: Task[] = [];

    // await Promise.all(
    //   notifications.map(async (item) => {
    //     const user = usersMap.get(item.userId);
    //     if (!user?.tokenFCM) return;
    //
    //     try {
    //       await this.taskRepository.update(item.id, { processing: true });
    //       await this.firebaseService.sendNotification(
    //         user.tokenFCM,
    //         item.title,
    //         item.body,
    //         { title: item.title, body: item.body },
    //       );
    //
    //       if (item.repeat === RepeatType.NONE) {
    //         item.sent = true;
    //       } else {
    //         item.scheduledAt = this.getNextScheduledDate(
    //           item.scheduledAt,
    //           item.repeat,
    //         );
    //       }
    //
    //       item.processing = false;
    //       toUpdate.push(item);
    //     } catch (err) {
    //       console.error(`Failed to send notification ${item.id}`, err);
    //       await this.taskRepository.update(item.id, { processing: false });
    //     }
    //   }),
    // );

    if (toUpdate.length) {
      await this.taskRepository.save(toUpdate);
    }
  }

  private getNextScheduledDate(date: Date, repeat: RepeatType): Date {
    const next = new Date(date);
    switch (repeat) {
      case RepeatType.HOURLY:
        next.setHours(next.getHours() + 1);
        break;
      case RepeatType.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case RepeatType.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case RepeatType.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  }

  async performScheduledTask() {
    console.log('Executing scheduled task...');
    const now = new Date();

    const notifications = await this.taskRepository.find({
      where: {
        scheduledAt: LessThanOrEqual(now),
        sent: false,
        processing: false,
      },
    });

    if (!notifications.length) return;

    // const userIds = [...new Set(notifications.map((n) => n.userId))];
    // const usersMap = new Map(
    //   (await this.usersService.getManyByIds(userIds)).map((user) => [
    //     user.id,
    //     user,
    //   ]),
    // );

    const toUpdate: Task[] = [];

    // await Promise.all(
    //   notifications.map(async (item) => {
    //     const user = usersMap.get(item.userId);
    //     if (!user?.tokenFCM) return;
    //
    //     try {
    //       await this.taskRepository.update(item.id, { processing: true });
    //       await this.firebaseService.sendNotification(
    //         user.tokenFCM,
    //         item.title,
    //         item.body,
    //         { title: item.title, body: item.body },
    //       );
    //
    //       if (item.repeat === RepeatType.NONE) {
    //         item.sent = true;
    //       } else {
    //         item.scheduledAt = this.getNextScheduledDate(
    //           item.scheduledAt,
    //           item.repeat,
    //         );
    //       }
    //
    //       item.processing = false;
    //       toUpdate.push(item);
    //     } catch (err) {
    //       console.error(`Failed to send notification ${item.id}`, err);
    //       await this.taskRepository.update(item.id, { processing: false });
    //     }
    //   }),
    // );

    if (toUpdate.length) {
      await this.taskRepository.save(toUpdate);
    }
    console.log('Scheduled task completed');
  }
}
