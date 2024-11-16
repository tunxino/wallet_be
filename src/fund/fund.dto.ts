import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class FundDto {
  @IsString()
  title: string;

  @IsString()
  note: string;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  amount: number;

  @IsDateString()
  createDate: string;

  @IsDateString()
  endDate: string;
}
