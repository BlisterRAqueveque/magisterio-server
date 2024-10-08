import { ConsejoDirectivoEntity } from '@/web-services/consejo-directivo/entity/consejo-directivo.entity';
import { JuntaFiscalizacionEntity } from '@/web-services/junta-fiscalizaciones/entity/junta-fiscalizaciones..entity';
import { NoticiaEntity } from '@/web-services/noticias/entity/noticias.entity';
import { ResolucionEntity } from '@/web-services/resoluciones/entity/resoluciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '../../../auth/usuarios/entity/usuarios.entity';
import { CasaMutualEntity } from '../../../casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { HabitacionEntity } from '../../../casas.module/habitaciones/entity/habitaciones.entity';
import { ParcelaEntity } from '../../../casas.module/parcelas/entity/parcelas.entity';
import { DelegacionEntity } from '../../../general.module/delegaciones/entity/delegaciones.entity';

@Entity('ediciones')
export class EdicionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'text', nullable: true })
  descripcion: string;
  @CreateDateColumn()
  fecha_editado: Date;

  @JoinColumn({ name: 'ediciones_usuarios' })
  @ManyToOne(
    () => UsuarioEntity,
    (ediciones_usuarios) => ediciones_usuarios.ediciones,
  )
  ediciones_usuarios: UsuarioEntity;

  @JoinColumn({ name: 'ediciones_casa_mutual' })
  @ManyToOne(
    () => CasaMutualEntity,
    (ediciones_casa_mutual) => ediciones_casa_mutual.ediciones,
  )
  ediciones_casa_mutual: CasaMutualEntity;

  @JoinColumn({ name: 'ediciones_habitaciones' })
  @ManyToOne(
    () => HabitacionEntity,
    (ediciones_habitaciones) => ediciones_habitaciones.ediciones,
  )
  ediciones_habitaciones: HabitacionEntity;

  @JoinColumn({ name: 'ediciones_delegaciones' })
  @ManyToOne(
    () => DelegacionEntity,
    (ediciones_delegaciones) => ediciones_delegaciones.ediciones,
  )
  ediciones_delegaciones: DelegacionEntity;

  @JoinColumn({ name: 'ediciones_parcelas' })
  @ManyToOne(
    () => ParcelaEntity,
    (ediciones_parcelas) => ediciones_parcelas.ediciones,
  )
  ediciones_parcelas: ParcelaEntity;

  @JoinColumn({ name: 'ediciones_noticias' })
  @ManyToOne(
    () => NoticiaEntity,
    (ediciones_noticias) => ediciones_noticias.ediciones,
  )
  ediciones_noticias: NoticiaEntity;

  @ManyToOne(
    () => ConsejoDirectivoEntity,
    (ediciones_consejo_directivo) => ediciones_consejo_directivo.ediciones,
  )
  ediciones_consejo_directivo: ConsejoDirectivoEntity;

  @ManyToOne(
    () => JuntaFiscalizacionEntity,
    (ediciones_junta_fiscalizacion) => ediciones_junta_fiscalizacion.ediciones,
  )
  ediciones_junta_fiscalizacion: JuntaFiscalizacionEntity;

  @ManyToOne(
    () => ResolucionEntity,
    (ediciones_resoluciones) => ediciones_resoluciones.ediciones,
  )
  ediciones_resolucion: ResolucionEntity;
}
