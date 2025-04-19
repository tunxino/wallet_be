// notification/notification.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FirebaseService } from '../firebase/firebase.service';
import { Task } from './task.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
  ],
  controllers: [TaskController],
  providers: [TaskService, FirebaseService],
})
export class TaskModule {}
