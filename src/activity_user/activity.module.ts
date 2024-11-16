import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  providers: [ActivityService, FirebaseService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
