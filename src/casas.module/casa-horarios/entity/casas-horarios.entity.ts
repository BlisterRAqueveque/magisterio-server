import { CasaMutualEntity } from '@/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { DelegacionEntity } from '@/general.module/delegaciones/entity/delegaciones.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('casas_horarios')
export class CasaHorarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  horario: string;

  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.casa_horarios)
  casa_mutual: CasaMutualEntity;

  @ManyToOne(() => DelegacionEntity, (delegacion) => delegacion.casa_horarios)
  delegacion: DelegacionEntity;
}
