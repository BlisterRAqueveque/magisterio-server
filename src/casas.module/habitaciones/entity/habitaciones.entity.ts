import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('habitaciones')
export class HabitacionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @Column({ type: 'simple-array', nullable: true })
  servicios: string[];
  @DeleteDateColumn()
  borrado_el: Date;
  @Column({ type: 'bool', default: true })
  activo: boolean;
  @CreateDateColumn()
  fecha_creado: Date;

  @JoinColumn({ name: 'casa_mutual' })
  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.habitaciones)
  casa_mutual: CasaMutualEntity;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_habitaciones,
    { cascade: true },
  )
  ediciones: EdicionEntity[];

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.habitaciones)
  creado_por: UsuarioEntity;
}
