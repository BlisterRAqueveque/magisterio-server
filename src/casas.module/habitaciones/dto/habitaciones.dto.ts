import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { ReservaDto } from 'src/casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

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
