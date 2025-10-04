import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ActivityCategory, ActivityType } from './activity.enum';
import { Type } from 'class-transformer';

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

  imageUrl?: string;
}

export class UpdateActivityDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  note?: string;
}

export class DeleteActivityDto {
  @IsString()
  id: string;
}

export class GetWalletActivityDto {
  @IsString()
  walletId: string;
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

  get startOfDay(): string | undefined {
    if (!this.startDate) return undefined;
    const d = new Date(this.startDate);
    d.setHours(0, 0, 0, 0);
    return d.toISOString(); // ✅ Quan trọng
  }

  get endOfDay(): string | undefined {
    if (!this.endDate) return undefined;
    const d = new Date(this.endDate);
    d.setHours(23, 59, 59, 999);
    return d.toISOString(); // ✅ Quan trọng
  }
}

export class GetActivitiesChartDateRangeDto {
  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @IsEnum(ActivityType)
  type: ActivityType;
}

export class FilterDto {
  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;
}
