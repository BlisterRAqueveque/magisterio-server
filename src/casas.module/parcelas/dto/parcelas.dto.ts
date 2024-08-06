import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class ParcelaDto {
  id: number;
  nombre: string;

  casa_mutual: CasaMutualDto;

  ediciones: EdicionDto[];
}
