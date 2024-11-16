import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Before...${context.getHandler()}`);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((data) => console.log(`After.${data}.. ${Date.now() - now}ms`)),
      );
  }
}
