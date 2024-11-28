import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

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
  @IsString()
  isDefault: boolean;
}