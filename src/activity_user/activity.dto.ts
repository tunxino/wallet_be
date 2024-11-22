import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ActivityCategory, ActivityType } from './activity.enum';

export class CreateActivityDto {
  @IsString()
  walletId: string;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsEnum(ActivityCategory)
  category: ActivityCategory;

  @IsString()
  icon: string;

  @IsNumber()
  amount: number;

  @IsString()
  note: string;

  @IsDateString()
  date: string;
}

export class UpdateActivityDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @IsOptional()
  @IsEnum(ActivityCategory)
  category?: ActivityCategory;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class DeleteActivityDto {
  @IsString()
  id: string;
}

export class TypeActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;
}

export class GetActivitiesByDateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class GetActivitiesChartDateRangeDto {
  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @IsEnum(ActivityType)
  type: ActivityType;
}
