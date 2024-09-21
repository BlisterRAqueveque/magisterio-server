import { Module } from '@nestjs/common';
import { NoticiasController } from './noticias/noticias.controller';
import { NoticiasService } from './noticias/noticias.service';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiaEntity } from './noticias/entity/noticias.entity';
import { ConsejoDirectivoService } from './consejo-directivo/consejo-directivo.service';
import { ConsejoDirectivoController } from './consejo-directivo/consejo-directivo.controller';
import { ConsejoDirectivoEntity } from './consejo-directivo/entity/consejo-directivo.entity';
import { JuntaFiscalizacionesController } from './junta-fiscalizaciones/junta-fiscalizaciones.controller';
import { JuntaFiscalizacionesService } from './junta-fiscalizaciones/junta-fiscalizaciones.service';
import { JuntaFiscalizacionEntity } from './junta-fiscalizaciones/entity/junta-fiscalizaciones..entity';
import { ResolucionesService } from './resoluciones/resoluciones.service';
import { ResolucionesController } from './resoluciones/resoluciones.controller';
import { ResolucionEntity } from './resoluciones/entity/resoluciones.entity';
import { ArticulosController } from './articulos/articulos.controller';
import { ArticulosService } from './articulos/articulos.service';
import { ArticuloEntity } from './articulos/entity/articulos.entity';
import { saveImagesToStorage } from '@/middlewares/image-storage';
import { MulterModule } from '@nestjs/platform-express';
import { ConsideracionesController } from './consideraciones/consideraciones.controller';
import { ConsideracionesService } from './consideraciones/consideraciones.service';
import { ConsideracionEntity } from './consideraciones/entity/consideraciones.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoticiaEntity,
      ConsejoDirectivoEntity,
      JuntaFiscalizacionEntity,
      ResolucionEntity,
      ArticuloEntity,
      ConsideracionEntity,
    ]),
    AuthModule,
    MulterModule.register({
      dest: './uploads',
      fileFilter: saveImagesToStorage('noticias').fileFilter,
      storage: saveImagesToStorage('noticias').storage,
    }),
  ],
  controllers: [
    NoticiasController,
    ConsejoDirectivoController,
    JuntaFiscalizacionesController,
    ResolucionesController,
    ArticulosController,
    ConsideracionesController,
  ],
  providers: [
    NoticiasService,
    ConsejoDirectivoService,
    JuntaFiscalizacionesService,
    ResolucionesService,
    ArticulosService,
    ConsideracionesService,
  ],
})
export class WebServicesModule {}
