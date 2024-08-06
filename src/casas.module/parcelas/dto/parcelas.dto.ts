import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';

export class ParcelaDto {
  id: number;
  nombre: string;

  casa_mutual: CasaMutualDto;
}
