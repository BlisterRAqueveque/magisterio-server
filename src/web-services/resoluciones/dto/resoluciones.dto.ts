import { UsuarioDto } from '@/auth/usuarios/dto/usuarios.dto';
import { EdicionDto } from '@/general.module/ediciones/dto/ediciones.dto';
import { ArticuloDto } from '@/web-services/articulos/dto/articulos.dto';
import { ConsideracionDto } from '@/web-services/consideraciones/dto/consideraciones.dto';

export class ResolucionDto {
  id: number;
  resol: string;
  lugar: string;
  fecha: string;
  visto: string;

  consideraciones: ConsideracionDto[];

  activo: boolean;

  fecha_carga: Date;

  borrado_el: Date;

  creado_por: UsuarioDto;

  ediciones: EdicionDto[];

  articulos: ArticuloDto[];
}
