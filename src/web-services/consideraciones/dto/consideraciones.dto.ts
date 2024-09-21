import { ResolucionDto } from '@/web-services/resoluciones/dto/resoluciones.dto';

export class ConsideracionDto {
  id: number;
  consideracion: string;
  resolucion: ResolucionDto;
}
