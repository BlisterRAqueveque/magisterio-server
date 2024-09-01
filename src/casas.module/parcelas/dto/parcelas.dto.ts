import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from '../../../casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';
import { IngresoParcelaDto } from '../../ingreso-parcelas/dto/ingreso-parcela.dto';

export class ParcelaDto {
  id: number;
  nombre: string;
  fecha_creado: Date;
  activo: boolean;

  borrado_el: Date;

  creado_por: UsuarioDto;

  casa_mutual: CasaMutualDto;

  ediciones: EdicionDto[];

  ingresos: IngresoParcelaDto[];
}
