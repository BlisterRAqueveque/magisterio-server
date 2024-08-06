import { UsuarioDto } from 'src/auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from 'src/casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { HabitacionDto } from 'src/casas.module/habitaciones/dto/habitaciones.dto';
import { ParcelaDto } from 'src/casas.module/parcelas/dto/parcelas.dto';
import { DelegacionDto } from 'src/general.module/delegaciones/dto/delegaciones.dto';

export class EdicionDto {
  id: number;
  descripcion: string;
  fecha_editado: Date;

  ediciones_usuarios: UsuarioDto;

  ediciones_casa_mutual: CasaMutualDto;

  ediciones_habitaciones: HabitacionDto;

  ediciones_delegaciones: DelegacionDto;

  ediciones_parcelas: ParcelaDto;
}
