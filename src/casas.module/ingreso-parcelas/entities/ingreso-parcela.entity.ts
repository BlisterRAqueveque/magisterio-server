import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParcelaEntity } from '../../parcelas/entity/parcelas.entity';
import { UsuarioEntity } from '../../../auth/usuarios/entity/usuarios.entity';

@Entity('ingreso_parcelas')
export class IngresoParcelaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: true })
  n_socio: string;
  @Column('varchar', { nullable: true })
  nombre: string;
  @Column('varchar', { nullable: true })
  nombre_salida: string;

  @CreateDateColumn()
  ingreso_fecha: Date;

  @Column({ type: 'datetime', nullable: true })
  salida_fecha: Date;

  @ManyToOne(() => UsuarioEntity, (cerrado_por) => cerrado_por.ingreso_parcelas)
  cerrado_por: UsuarioEntity;

  @ManyToOne(() => ParcelaEntity, (parcela) => parcela.ingresos)
  parcela: ParcelaEntity;
}
