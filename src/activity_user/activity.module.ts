import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { Wallet } from '../wallet/wallet.entity';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Wallet]),
  ],
  providers: [ActivityService, FirebaseService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
