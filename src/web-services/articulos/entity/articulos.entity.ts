import { ResolucionEntity } from '@/web-services/resoluciones/entity/resoluciones.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('articulos')
export class ArticuloEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', nullable: true })
  art: number;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @CreateDateColumn()
  fecha_carga: Date;

  @ManyToOne(() => ResolucionEntity, (resolucion) => resolucion.articulos)
  resolucion: ResolucionEntity;
}
