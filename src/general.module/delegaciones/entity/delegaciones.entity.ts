import { ReservaEntity } from '../../../casas.module/reservas/entity/reservas.entity';
import { EdicionEntity } from '../../../general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('delegaciones')
export class DelegacionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'int', default: 0 })
  co: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @Column({ type: 'varchar', nullable: true })
  tel: string;
  @Column({ type: 'varchar', nullable: true })
  cel: string;
  @Column({ type: 'int', default: 0 })
  cp: number;
  @Column({ type: 'varchar', nullable: true })
  domicilio: string;
  @Column({ type: 'varchar', nullable: true })
  email: string;
  @Column({ type: 'simple-array', nullable: true })
  horarios: string[];

  @CreateDateColumn()
  fecha_creado: Date;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_delegaciones,
    { cascade: true },
  )
  ediciones: EdicionEntity[];

  @OneToMany(() => ReservaEntity, (reservas) => reservas.delegacion)
  reservas: ReservaEntity[];
}
