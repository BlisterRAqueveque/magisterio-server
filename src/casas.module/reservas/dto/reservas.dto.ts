import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { HabitacionDto } from '../../../casas.module/habitaciones/dto/habitaciones.dto';
import { DelegacionDto } from '../../../general.module/delegaciones/dto/delegaciones.dto';

export class ReservaDto {
  id: number;
  nombre: string;
  apellido: string;
  n_socio: string;
  tel: string;
  correo: string;

  desde: Date;
  hasta: Date;

  estado: number;

  fecha_creado: Date;
  fecha_aprobado: Date;

  usuario_aprobador: UsuarioDto;

  delegacion: DelegacionDto;
  habitacion: HabitacionDto;
}
