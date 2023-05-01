import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const defaultPort = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Air Quality Index')
    .setDescription('Get air quality information about different countries')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT', defaultPort);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
