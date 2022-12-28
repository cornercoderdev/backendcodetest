import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.use(compression());
  app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMIT }));
  app.use(
    bodyParser.urlencoded({
      limit: process.env.BODY_PARSER_LIMIT,
      extended: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
