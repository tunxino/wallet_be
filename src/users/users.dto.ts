import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SocialLoginDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  tokenFCM: string;
}
