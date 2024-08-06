import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { HabitacionDto } from 'src/casas.module/habitaciones/dto/habitaciones.dto';
import { ParcelaDto } from 'src/casas.module/parcelas/dto/parcelas.dto';
import { EdicionDto } from 'src/general.module/ediciones/dto/ediciones.dto';

export class CasaMutualDto {
  id: number;
  nombre: string;
  fecha_creado: Date;

  usuarios: UsuarioDto[];
  Habitaciones: HabitacionDto[];
  parcelas: ParcelaDto[];

  ediciones: EdicionDto[];
}
