if (!process.env.IS_TS_ENV) {
  require('module-alias/register');
}

import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4321',
      'https://studio.apollographql.com',
      'https://wdyw.net',
      'https://wdyw.io',
    ], // fix me
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
