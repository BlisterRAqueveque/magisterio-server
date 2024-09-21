import { ResolucionEntity } from '@/web-services/resoluciones/entity/resoluciones.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consideraciones')
export class ConsideracionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'text', nullable: true })
  consideracion: string;

  @ManyToOne(() => ResolucionEntity, (resolucion) => resolucion.consideraciones)
  resolucion: ResolucionEntity;
}
