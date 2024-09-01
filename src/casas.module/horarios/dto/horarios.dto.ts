import { CasaMutualDto } from '../../../casas.module/casas-mutuales/dto/casas-mutuales.dto';

export class HorarioDto {
  id: number;

  inicio_periodo: Date;

  fin_periodo: Date;

  casa_mutual: CasaMutualDto;
}
