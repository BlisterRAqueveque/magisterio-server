/**
 * @description
 * Definir los horarios que va a manejar cada casa mutual, un desde o hasta, caso
 * que los valores sean nulos, no va a aplicar para generar los registros que van a cerrar los alquileres por un periodo de  tiempo
 */

import { CasaMutualEntity } from '../../../casas.module/casas-mutuales/entity/casas-mutuales.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('horarios')
export class HorarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'datetime', nullable: true })
  inicio_periodo: Date;

  @Column({ type: 'datetime', nullable: true })
  fin_periodo: Date;

  @OneToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.horarios)
  casa_mutual: CasaMutualEntity;
}
