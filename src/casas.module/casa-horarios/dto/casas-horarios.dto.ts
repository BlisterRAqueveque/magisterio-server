import { CasaMutualDto } from '@/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { DelegacionDto } from '@/general.module/delegaciones/dto/delegaciones.dto';

export class CasaHorarioDto {
  id: number;
  horario: string;

  casa_mutual: CasaMutualDto;

  delegacion: DelegacionDto;
}
