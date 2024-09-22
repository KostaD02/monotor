import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerSide } from '@fitmonitor/util';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const options: Record<string, string | boolean | number> = {};

  if (process.env.HIDE_NEST_LOGS) {
    options.logger = false;
  }

  const app = await NestFactory.create(AppModule, options);
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('FitMonitor API')
    .setDescription('The FitMonitor API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/api`,
    LoggerSide.Server
  );
}

bootstrap();
