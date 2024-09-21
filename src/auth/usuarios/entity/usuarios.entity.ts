import { IngresoParcelaEntity } from '../../../casas.module/ingreso-parcelas/entities/ingreso-parcela.entity';
import { CasaMutualEntity } from '../../../casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { HabitacionEntity } from '../../../casas.module/habitaciones/entity/habitaciones.entity';
import { ParcelaEntity } from '../../../casas.module/parcelas/entity/parcelas.entity';
import { ReservaEntity } from '../../../casas.module/reservas/entity/reservas.entity';
import { EdicionEntity } from '../../../general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticiaEntity } from '@/web-services/noticias/entity/noticias.entity';
import { ConsejoDirectivoEntity } from '@/web-services/consejo-directivo/entity/consejo-directivo.entity';
import { JuntaFiscalizacionEntity } from '@/web-services/junta-fiscalizaciones/entity/junta-fiscalizaciones..entity';
import { ResolucionEntity } from '@/web-services/resoluciones/entity/resoluciones.entity';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false, unique: true })
  usuario: string;
  @Column({ type: 'varchar', nullable: true, unique: true })
  correo: string;
  @Column({ type: 'varchar', nullable: true })
  nombre: string;
  @Column({ type: 'varchar', nullable: true })
  apellido: string;
  @Column({ type: 'varchar', nullable: true })
  nombre_completo: string;
  @Column({ type: 'varchar', nullable: false })
  clave: string;
  @CreateDateColumn()
  fecha_creado: Date;
  @Column({ type: 'datetime', nullable: true })
  primer_login: Date;
  @Column({
    type: 'bool',
    default: false,
    comment: 'Acceso a super administradores, control total',
  })
  superadmin: boolean;
  @Column({
    type: 'bool',
    default: false,
    comment: 'Acceso a administradores, control parcial / total',
  })
  admin: boolean;

  @Column({ type: 'bool', default: true })
  activo: boolean;

  @DeleteDateColumn()
  borrado_el: Date;

  @JoinTable({
    name: 'usuario_casas_mutual',
    joinColumn: {
      name: 'usuario',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'casa_mutual',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => CasaMutualEntity, (casa_mutual) => casa_mutual.usuarios)
  casa_mutual: CasaMutualEntity[];

  @OneToMany(
    () => ReservaEntity,
    (reservas_aprovadas) => reservas_aprovadas.usuario_aprobador,
  )
  reservas_aprobadas: ReservaEntity[];

  @OneToMany(() => EdicionEntity, (ediciones) => ediciones.ediciones_usuarios, {
    cascade: true,
  })
  ediciones: EdicionEntity[];

  @JoinColumn({ name: 'creado_por' })
  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.usuarios_creados)
  creado_por: UsuarioEntity;

  @OneToMany(
    () => CasaMutualEntity,
    (carga_casa_mutual) => carga_casa_mutual.creado_por,
  )
  carga_casa_mutual: CasaMutualEntity[];

  @OneToMany(
    () => UsuarioEntity,
    (usuarios_creados) => usuarios_creados.creado_por,
  )
  usuarios_creados: UsuarioEntity[];

  @OneToMany(() => HabitacionEntity, (habitaciones) => habitaciones.creado_por)
  habitaciones: HabitacionEntity[];

  @OneToMany(() => ParcelaEntity, (habitaciones) => habitaciones.creado_por)
  parcelas: ParcelaEntity[];

  @OneToMany(
    () => IngresoParcelaEntity,
    (ingreso_parcelas) => ingreso_parcelas.cerrado_por,
  )
  ingreso_parcelas: IngresoParcelaEntity[];

  @OneToMany(() => NoticiaEntity, (noticias) => noticias.creado_por)
  noticias: NoticiaEntity[];

  @OneToMany(
    () => ConsejoDirectivoEntity,
    (consejos_directivos) => consejos_directivos.creado_por,
  )
  consejos_directivos: ConsejoDirectivoEntity[];

  @OneToMany(
    () => JuntaFiscalizacionEntity,
    (junta_fiscalizaciones) => junta_fiscalizaciones.creado_por,
  )
  junta_fiscalizaciones: JuntaFiscalizacionEntity[];

  @OneToMany(() => ResolucionEntity, (resoluciones) => resoluciones.creado_por)
  resoluciones: ResolucionEntity[];
}
