import { NestFactory } from '@nestjs/core';
import { MailAppModule } from './mailapp.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  //* Hacemos que la app principal pase de ser un modulo completo, a un micro servicio
  //* Ahora no se expone en un puerto, sino que el mismo escucha y espera eventos solamente.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailAppModule,
    { transport: Transport.REDIS },
  );

  await app.listen();
}
bootstrap();
