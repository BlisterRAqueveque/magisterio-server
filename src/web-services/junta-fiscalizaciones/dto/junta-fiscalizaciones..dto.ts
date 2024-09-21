import { UsuarioDto } from '@/auth/usuarios/dto/usuarios.dto';
import { EdicionDto } from '@/general.module/ediciones/dto/ediciones.dto';

export class JuntaFiscalizacionDto {
  id: number;
  cargo: string;
  nombre: string;
  n_socio: string;
  dni: string;
  activo: boolean;

  fecha_carga: Date;

  borrado_el: Date;

  creado_por: UsuarioDto;

  ediciones: EdicionDto[];
}
