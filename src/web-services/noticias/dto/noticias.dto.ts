import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class NoticiaDto {
  id: number;

  background: string;

  title: string;

  subtitle: string;

  news: string;

  active: boolean;

  fecha_creado: Date;

  borrado_el: Date;

  creado_por: UsuarioDto;

  ediciones: EdicionDto[];
}
