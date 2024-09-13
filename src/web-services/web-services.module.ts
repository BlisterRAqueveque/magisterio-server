import { Module } from '@nestjs/common';
import { NoticiasController } from './noticias/noticias.controller';
import { NoticiasService } from './noticias/noticias.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiaEntity } from './noticias/entity/noticias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoticiaEntity]), AuthModule],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class WebServicesModule {}
