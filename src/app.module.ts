import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as express from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CasasModule } from './casas.module/casas.module';
import { dbConfig, mConfig } from './configurations';
import { GeneralModule } from './general.module/general.module';
import { AuthMiddleware } from './middlewares/auth';
import { WebServicesModule } from './web-services/web-services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    MailerModule.forRoot(mConfig),
    AuthModule,
    CasasModule,
    GeneralModule,
    WebServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        express.json({ limit: '50mb' }),
        express.urlencoded({ limit: '50mb', extended: true }),
      )
      .exclude(
        //! Except:
        {
          path: 'usuarios/auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'usuarios/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'casas-mutuales/get-all/habitaciones',
          method: RequestMethod.GET,
        },
        {
          path: 'reservas/room/:id',
          method: RequestMethod.GET,
        },
        {
          path: 'reservas',
          method: RequestMethod.POST,
        },
        {
          path: 'ingreso-parcelas/entity/status/:id',
          method: RequestMethod.GET,
        },
        {
          path: 'ingreso-parcelas',
          method: RequestMethod.POST,
        },
        {
          path: 'ingreso-parcelas/:id',
          method: RequestMethod.PUT,
        },
        {
          path: 'noticias/:id',
          method: RequestMethod.GET,
        },
        {
          path: 'noticias',
          method: RequestMethod.GET,
        },
        {
          path: 'junta-fiscalizaciones',
          method: RequestMethod.GET,
        },
        {
          path: 'consejo-directivo',
          method: RequestMethod.GET,
        },
        {
          path: 'resoluciones',
          method: RequestMethod.GET,
        },
        {
          path: 'casas-mutuales',
          method: RequestMethod.GET,
        },
        {
          path: 'delegaciones',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('');
  }
}
