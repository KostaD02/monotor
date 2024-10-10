import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerSide } from '@monotor/util';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { HttpExceptionsFilter } from './http-exceptions.filter';
import { CustomLogger } from './logger';

async function bootstrap() {
  const options: Record<string, string | boolean | number | CustomLogger> = {
    logger: new CustomLogger(),
  };

  if (process.env.HIDE_NEST_LOGS === 'true') {
    options.logger = false;
  }

  if (!process.env.JWT_SECRET) {
    Logger.error('❌ JWT_SECRET is required in .env', LoggerSide.Server);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, options);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionsFilter());

  const port = process.env.PORT || 2222;

  const config = new DocumentBuilder()
    .setTitle('MonoTor API')
    .setDescription('The MonoTor API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/api`,
    LoggerSide.Server,
  );
}

bootstrap();
