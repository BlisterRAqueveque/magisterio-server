import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { HabitacionDto } from '../../../casas.module/habitaciones/dto/habitaciones.dto';
import { HorarioDto } from '../../../casas.module/horarios/dto/horarios.dto';
import { ParcelaDto } from '../../../casas.module/parcelas/dto/parcelas.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';

export class CasaMutualDto {
  id: number;
  co: number;
  nombre: string;
  direccion: string;
  tel: string;
  cel: string;
  correo: string;
  cp: number;
  fecha_creado: Date;
  activo: boolean;

  borrado_el: Date;

  creado_por: UsuarioDto;

  usuarios: UsuarioDto[];

  habitaciones: HabitacionDto[];

  parcelas: ParcelaDto[];

  horarios: HorarioDto;

  ediciones: EdicionDto[];
}
