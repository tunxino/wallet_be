import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    req.log.info({
      type: 'http-request',
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    next();
  }
}
