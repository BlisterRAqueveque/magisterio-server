import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
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

  @JoinColumn({ name: 'casa_mutual' })
  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.habitaciones)
  casa_mutual: CasaMutualEntity;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_habitaciones,
    { cascade: true },
  )
  ediciones: EdicionEntity[];
}
