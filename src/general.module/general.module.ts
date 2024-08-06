import { Module } from '@nestjs/common';
import { EdicionesController } from './ediciones/ediciones.controller';
import { EdicionesService } from './ediciones/ediciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdicionEntity } from './ediciones/entity/ediciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EdicionEntity])],
  controllers: [EdicionesController],
  providers: [EdicionesService],
})
export class GeneralModule {}
