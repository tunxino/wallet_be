import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RepeatType } from './task.entity';

export class CreateScheduledTaskDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsDateString()
  @Type(() => Date)
  scheduledAt: Date;

  @IsOptional()
  @IsEnum(RepeatType)
  repeat?: RepeatType;
}

export class DeleteScheduledTaskDto {
  @IsString()
  id: string;
}
