import { UsuarioDto } from '@/auth/usuarios/dto/usuarios.dto';
import { EdicionDto } from '@/general.module/ediciones/dto/ediciones.dto';

export class NoticiaDto {
  id: number;

  background: string;

  title: string;

  subtitle: string;

  news: string;

  activo: boolean;

  fecha_creado: Date;

  borrado_el: Date;

  creado_por: UsuarioDto;

  ediciones: EdicionDto[];
}
