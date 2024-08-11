import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { HabitacionDto } from 'src/casas.module/habitaciones/dto/habitaciones.dto';
import { HorarioDto } from 'src/casas.module/horarios/dto/horarios.dto';
import { ParcelaDto } from 'src/casas.module/parcelas/dto/parcelas.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class CasaMutualDto {
  id: number;
  co: number;
  nombre: string;
  direccion: string;
  tel: string;
  cel: string;
  cp: number;
  fecha_creado: Date;
  creado_por: UsuarioDto;

  activo: boolean;
  borrado_el: Date;

  usuarios: UsuarioDto[];
  habitaciones: HabitacionDto[];
  parcelas: ParcelaDto[];
  horarios: HorarioDto[];

  ediciones: EdicionDto[];
}
