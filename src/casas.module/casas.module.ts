import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasasMutualesController } from './casas-mutuales/casas-mutuales.controller';
import { CasasMutualesService } from './casas-mutuales/casas-mutuales.service';
import { CasaMutualEntity } from './casas-mutuales/entity/casas-mutuales.entity';
import { HabitacionesController } from './habitaciones/habitaciones.controller';
import { HabitacionesService } from './habitaciones/habitaciones.service';
import { HabitacionEntity } from './habitaciones/entity/habitaciones.entity';
import { ParcelasService } from './parcelas/parcelas.service';
import { ParcelasController } from './parcelas/parcelas.controller';
import { ParcelaEntity } from './parcelas/entity/parcelas.entity';
import { ReservasController } from './reservas/reservas.controller';
import { ReservasService } from './reservas/reservas.service';
import { ReservaEntity } from './reservas/entity/reservas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasaMutualEntity,
      HabitacionEntity,
      ParcelaEntity,
      ReservaEntity,
    ]),
  ],
  providers: [
    CasasMutualesService,
    HabitacionesService,
    ParcelasService,
    ReservasService,
  ],
  controllers: [
    CasasMutualesController,
    HabitacionesController,
    ParcelasController,
    ReservasController,
  ],
})
export class CasasModule {}
