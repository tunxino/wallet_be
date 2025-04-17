import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { Wallet } from '../wallet/wallet.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '../users/user.entity';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Wallet, User]), FirebaseModule],
  providers: [ActivityService, SupabaseService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
