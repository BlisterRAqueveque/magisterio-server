import { ReservaDto } from '../../../casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';

export class DelegacionDto {
  id: number;
  co: number;
  nombre: string;
  tel: string;
  cel: string;
  cp: number;
  domicilio: string;
  email: string;
  horarios: string[];

  fecha_creado: Date;

  ediciones: EdicionDto[];

  reservas: ReservaDto[];
}
