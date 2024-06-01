import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN?.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(config.get('server.port'));
}
bootstrap();
