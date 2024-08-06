import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('parcelas')
export class ParcelaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @JoinColumn({ name: 'casa_mutual' })
  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.parcelas)
  casa_mutual: CasaMutualEntity;
}
