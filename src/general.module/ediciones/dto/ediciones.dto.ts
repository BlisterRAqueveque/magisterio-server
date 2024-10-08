import { NoticiaDto } from '@/web-services/noticias/dto/noticias.dto';
import { UsuarioDto } from '../../../auth/usuarios/dto/usuarios.dto';
import { CasaMutualDto } from '../../../casas.module/casas-mutuales/dto/casas-mutuales.dto';
import { HabitacionDto } from '../../../casas.module/habitaciones/dto/habitaciones.dto';
import { ParcelaDto } from '../../../casas.module/parcelas/dto/parcelas.dto';
import { DelegacionDto } from '../../../general.module/delegaciones/dto/delegaciones.dto';
import { ConsejoDirectivoDto } from '@/web-services/consejo-directivo/dto/consejo-directivo.dto';
import { JuntaFiscalizacionDto } from '@/web-services/junta-fiscalizaciones/dto/junta-fiscalizaciones..dto';
import { ResolucionDto } from '@/web-services/resoluciones/dto/resoluciones.dto';

export class EdicionDto {
  id: number;
  descripcion: string;
  fecha_editado: Date;

  ediciones_usuarios: UsuarioDto;

  ediciones_casa_mutual: CasaMutualDto;

  ediciones_habitaciones: HabitacionDto;

  ediciones_delegaciones: DelegacionDto;

  ediciones_parcelas: ParcelaDto;

  ediciones_noticias: NoticiaDto;

  ediciones_consejo_directivo: ConsejoDirectivoDto;

  ediciones_junta_fiscalizacion: JuntaFiscalizacionDto;

  ediciones_resolucion: ResolucionDto;
}
