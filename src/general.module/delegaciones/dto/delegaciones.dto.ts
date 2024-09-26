import { CasaHorarioDto } from '@/casas.module/casa-horarios/dto/casas-horarios.dto';
import { ReservaDto } from '../../../casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';
import { UsuarioDto } from '@/auth/usuarios/dto/usuarios.dto';

export class DelegacionDto {
  id: number;
  co: number;
  nombre: string;
  tel: string;
  cel: string;
  cp: number;
  direccion: string;
  correo: string;
  activo: boolean;
  email: string;

  casa_horarios: CasaHorarioDto[];

  fecha_creado: Date;

  ediciones: EdicionDto[];

  reservas: ReservaDto[];

  usuarios: UsuarioDto[];
  borrado_el: Date;
  creado_por: UsuarioDto;
}
