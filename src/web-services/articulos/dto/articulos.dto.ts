import { ResolucionDto } from '@/web-services/resoluciones/dto/resoluciones.dto';

export class ArticuloDto {
  id: number;

  art: number;

  desc: string;

  fecha_carga: Date;

  resolucion: ResolucionDto;
}
