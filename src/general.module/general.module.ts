import { Module } from '@nestjs/common';
import { EdicionesController } from './ediciones/ediciones.controller';
import { EdicionesService } from './ediciones/ediciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdicionEntity } from './ediciones/entity/ediciones.entity';
import { DelegacionesService } from './delegaciones/delegaciones.service';
import { DelegacionesController } from './delegaciones/delegaciones.controller';
import { DelegacionEntity } from './delegaciones/entity/delegaciones.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EdicionEntity, DelegacionEntity]),
    AuthModule,
  ],
  controllers: [EdicionesController, DelegacionesController],
  providers: [EdicionesService, DelegacionesService],
})
export class GeneralModule {}
