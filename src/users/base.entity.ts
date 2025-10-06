import { IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../common/const';
import { FastifyRequest } from 'fastify';

export class ResponseBase {
  message: string;
  code: number;
  data?: any;
}

export function successResponse<T = any>(data?: T) {
  return {
    message: MESSAGES.SUCCESS,
    code: HttpStatus.OK,
    ...(data !== undefined && { data }),
  };
}

export class VerifyOtpDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
  };
}

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  fieldname: string;
  size: number;
}
