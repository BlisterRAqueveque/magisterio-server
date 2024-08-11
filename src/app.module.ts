import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as express from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { dbConfig } from './configurations/configuration';
import { AuthMiddleware } from './middlewares/auth';
import { saveImagesToStorage } from './middlewares/image-storage';
import { CasasModule } from './casas.module/casas.module';
import { GeneralModule } from './general.module/general.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    MulterModule.register({
      dest: './uploads',
      fileFilter: saveImagesToStorage('images').fileFilter,
      storage: saveImagesToStorage('images').storage,
    }),
    AuthModule,
    CasasModule,
    GeneralModule,
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
      )
      .forRoutes('');
  }
}
