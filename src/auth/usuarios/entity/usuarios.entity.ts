import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
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

  @OneToMany(() => EdicionEntity, (ediciones) => ediciones.ediciones_usuarios)
  ediciones: EdicionEntity[];

  @JoinColumn({ name: 'casa_mutual' })
  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.usuarios)
  casa_mutual: CasaMutualEntity;
}
