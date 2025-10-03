import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds?: number[];
}

export class InviteUserDto {
  @IsNotEmpty()
  groupId: string;
  @IsNotEmpty()
  userId: number;
}

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  payerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseShareInput)
  shares: ExpenseShareInput[];
}

export class ExpenseShareInput {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  shareAmount?: number;
}
