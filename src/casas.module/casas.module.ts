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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasaMutualEntity,
      HabitacionEntity,
      ParcelaEntity,
    ]),
  ],
  providers: [CasasMutualesService, HabitacionesService, ParcelasService],
  controllers: [
    CasasMutualesController,
    HabitacionesController,
    ParcelasController,
  ],
})
export class CasasModule {}
