import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { ParcelaDto } from '../../parcelas/dto/parcelas.dto';

export class IngresoParcelaDto {
  id: number;

  n_socio: string;
  nombre: string;
  nombre_salida: string;

  ingreso_fecha: Date;
  salida_fecha: Date;

  cerrado_por: UsuarioDto;

  parcela: ParcelaDto;
}
