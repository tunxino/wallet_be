import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { FundEntity } from './fund.entity';
import { FundService } from './fund.service';
import { FundController } from './fund.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FundEntity])],
  providers: [FundService, FirebaseService],
  controllers: [FundController],
  exports: [FundService],
})
export class FundModule {}
