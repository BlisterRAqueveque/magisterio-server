import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class ParcelaDto {
  id: number;
  nombre: string;
  fecha_creado: Date;
  activo: boolean;

  borrado_el: Date;

  creado_por: UsuarioDto;

  casa_mutual: CasaMutualDto;

  ediciones: EdicionDto[];
}
