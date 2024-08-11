import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { ReservaEntity } from 'src/casas.module/reservas/entity/reservas.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
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
  reservas_aprovadas: ReservaEntity[];

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
}
