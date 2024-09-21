import { IngresoParcelaDto } from '../../../casas.module/ingreso-parcelas/dto/ingreso-parcela.dto';
import { CasaMutualDto } from '../../../casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { HabitacionDto } from '../../../casas.module/habitaciones/dto/habitaciones.dto';
import { ParcelaDto } from '../../../casas.module/parcelas/dto/parcelas.dto';
import { ReservaDto } from '../../../casas.module/reservas/dto/reservas.dto';
import { EdicionDto } from '../../../general.module/ediciones/dto/ediciones.dto';
import { NoticiaDto } from '@/web-services/noticias/dto/noticias.dto';
import { ConsejoDirectivoDto } from '@/web-services/consejo-directivo/dto/consejo-directivo.dto';
import { JuntaFiscalizacionDto } from '@/web-services/junta-fiscalizaciones/dto/junta-fiscalizaciones..dto';
import { ResolucionDto } from '@/web-services/resoluciones/dto/resoluciones.dto';

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

  reservas_aprobadas: ReservaDto[];

  ediciones: EdicionDto[];

  creado_por: UsuarioDto;

  carga_casa_mutual: CasaMutualDto[];

  usuarios_creados: UsuarioDto[];

  habitaciones: HabitacionDto[];

  parcelas: ParcelaDto[];

  ingreso_parcelas: IngresoParcelaDto[];

  noticias: NoticiaDto[];

  consejos_directivos: ConsejoDirectivoDto[];

  junta_fiscalizaciones: JuntaFiscalizacionDto[];

  resoluciones: ResolucionDto[];
}
