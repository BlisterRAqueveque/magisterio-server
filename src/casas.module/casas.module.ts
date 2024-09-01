import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Mailer } from '../helpers';
import { CasasMutualesController } from './casas-mutuales/casas-mutuales.controller';
import { CasasMutualesService } from './casas-mutuales/casas-mutuales.service';
import { CasaMutualEntity } from './casas-mutuales/entity/casas-mutuales.entity';
import { HabitacionEntity } from './habitaciones/entity/habitaciones.entity';
import { HabitacionesController } from './habitaciones/habitaciones.controller';
import { HabitacionesService } from './habitaciones/habitaciones.service';
import { HorarioEntity } from './horarios/entity/horarios.entity';
import { HorariosController } from './horarios/horarios.controller';
import { HorariosService } from './horarios/horarios.service';
import { IngresoParcelaEntity } from './ingreso-parcelas/entities/ingreso-parcela.entity';
import { IngresoParcelasController } from './ingreso-parcelas/ingreso-parcelas.controller';
import { IngresoParcelasService } from './ingreso-parcelas/ingreso-parcelas.service';
import { ParcelaEntity } from './parcelas/entity/parcelas.entity';
import { ParcelasController } from './parcelas/parcelas.controller';
import { ParcelasService } from './parcelas/parcelas.service';
import { ReservaEntity } from './reservas/entity/reservas.entity';
import { ReservasController } from './reservas/reservas.controller';
import { ReservasService } from './reservas/reservas.service';
import { ParcelasGateway } from './socket.io/parcelas.gateway';
import { ParcelasEventEmitter } from './socket.io/event-emitter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasaMutualEntity,
      HabitacionEntity,
      ParcelaEntity,
      ReservaEntity,
      HorarioEntity,
      IngresoParcelaEntity,
    ]),
    AuthModule,
  ],
  providers: [
    CasasMutualesService,
    HabitacionesService,
    ParcelasService,
    ReservasService,
    HorariosService,
    IngresoParcelasService,
    Mailer,
    ParcelasGateway,
    ParcelasEventEmitter,
  ],
  controllers: [
    CasasMutualesController,
    HabitacionesController,
    ParcelasController,
    ReservasController,
    HorariosController,
    IngresoParcelasController,
  ],
})
export class CasasModule {}
