import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import compress from '@fastify/compress';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import pino from 'pino';

const transport = pino.transport({
  target: '@logtail/pino',
  options: {
    sourceToken: 'd264JAqQ2cm4xRMHF6cGZ9qt',
    options: { endpoint: 'https://s1365228.eu-nbg-2.betterstackdata.com' },
  },
});

const logger = pino(transport);

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ logger });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useStaticAssets({
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // cache 1 năm
    },
  });
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });

  await app.register(compress, { global: true });

  await app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
