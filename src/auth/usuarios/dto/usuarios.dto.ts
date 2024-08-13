import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { HabitacionDto } from 'src/casas.module/habitaciones/dto/habitaciones.dto';
import { ParcelaDto } from 'src/casas.module/parcelas/dto/parcelas.dto';
import { ReservaDto } from 'src/casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class UsuarioDto {
  id: number;
  usuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  clave: string;
  fecha_creado: Date;
  primer_login: Date;

  superadmin: boolean;

  admin: boolean;

  activo: boolean;

  borrado_el: Date;

  casa_mutual: CasaMutualDto[];

  reservas_aprovadas: ReservaDto[];

  ediciones: EdicionDto[];

  creado_por: UsuarioDto;

  carga_casa_mutual: CasaMutualDto[];

  usuarios_creados: UsuarioDto[];

  habitaciones: HabitacionDto[];

  parcelas: ParcelaDto[];
}
