import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { DelegacionDto } from 'src/general.module/delegaciones/dto/delegaciones.dto';

export class ReservaDto {
  id: number;
  nombre: string;
  apellido: string;
  n_socio: string;
  tel: string;
  correo: string;

  aprobado: boolean;

  fecha_creado: Date;
  fecha_aprobado: Date;

  usuario_aprobador: UsuarioDto;

  delegacion: DelegacionDto;
}
