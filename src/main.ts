import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configurations';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(envs.port);

  logger.log(`Server running on port: ${envs.port}`);
}
bootstrap();
