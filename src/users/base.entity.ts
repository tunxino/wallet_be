import { IsString } from "class-validator";

export class ResponseBase {
  message: string;
  code: number;
  data?: any;
}


export class VerifyOtpDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}