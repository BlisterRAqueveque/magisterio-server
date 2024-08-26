import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from '../../../casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { ReservaDto } from '../../../casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';

export class HabitacionDto {
  id: number;
  nombre: string;
  servicios: string[];
  borrado_el: Date;
  activo: boolean;
  fecha_creado: Date;

  casa_mutual: CasaMutualDto;

  ediciones: EdicionDto[];

  creado_por: UsuarioDto;

  reservas: ReservaDto[];
}
