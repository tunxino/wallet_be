import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CronApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    const apiKey = process.env.API_KEY_CRON_JOB;
    const expectedHeader = `Bearer ${apiKey}`;

    if (authHeader !== expectedHeader) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
