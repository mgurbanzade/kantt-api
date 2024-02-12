if (!process.env.IS_TS_ENV) {
  require('module-alias/register');
}

import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDev = process.env.NODE_ENV === 'development';
  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000', 'https://studio.apollographql.com']
      : [process.env.FE_URL],
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
