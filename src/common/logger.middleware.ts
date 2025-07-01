import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyInstance } from 'fastify';
import pino from 'pino';

const transport = pino.transport({
  target: '@logtail/pino',
  options: {
    sourceToken: 'd264JAqQ2cm4xRMHF6cGZ9qt',
    options: { endpoint: 'https://s1365228.eu-nbg-2.betterstackdata.com' },
  },
});

const logger = pino(transport);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const log = {
      type: 'http-request',
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: await parseBody(req),
    };

    req.log.info(log);
    next();
  }
}

async function parseBody(req: FastifyRequest): Promise<any> {
  if (req.method === 'GET' || req.method === 'DELETE') return null;

  // Nếu body đã có (do pipe đã parse rồi)
  if (req.body) return req.body;

  try {
    // Nếu body chưa có, thử parse thủ công
    const raw = await req.body.toString();
    return JSON.parse(raw || '{}');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return { raw: '[unparsable body]' };
  }
}

export function setupRequestLogger(app: FastifyInstance) {
  app.addHook('onRequest', async (req, res) => {
    logger.info(`${req.method} ${req.url} Incoming request`, {
      method: req.method,
      url: req.url,
      headers: JSON.stringify(req.headers),
    });
  });

  app.addHook('preHandler', async (req, res) => {
    try {
      logger.info(`${req.method} ${req.url} request body`, {
        body: JSON.stringify(req.body ?? '[empty]'),
      });
    } catch (err) {
      logger.error('Error logging body', { error: err.message });
    }
  });

  app.addHook('onSend', async (req, res, payload) => {
    let responseText = '[unreadable]';
    try {
      if (Buffer.isBuffer(payload)) responseText = payload.toString();
      else if (typeof payload === 'object')
        responseText = JSON.stringify(payload);
      else if (typeof payload === 'string') responseText = payload;
    } catch (err) {
      responseText = '[error parsing payload]';
    }

    try {
      logger.info(`${req.method} ${req.url} response`, {
        statusCode: res.statusCode,
        response: responseText.slice(0, 1000),
      });
    } catch (err) {
      logger.error('Error logging response', { error: err.message });
    }

    return payload;
  });
}
