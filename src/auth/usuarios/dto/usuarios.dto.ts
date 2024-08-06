import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class UsuarioDto {
  id: string;
  usuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  clave: string;
  fecha_creado: Date;
  primer_login: Date;

  ediciones: EdicionDto[];

  casa_mutual: CasaMutualDto;
}
