import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class WalletDto {
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsBoolean()
  isDefault: boolean;
}


export class WalletEditDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  currency: string;

  @IsOptional()
  @IsBoolean()
  isDefault: boolean;
}