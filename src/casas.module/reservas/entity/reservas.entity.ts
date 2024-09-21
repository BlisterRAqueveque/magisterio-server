import { UsuarioEntity } from '../../../auth/usuarios/entity/usuarios.entity';
import { HabitacionEntity } from '../../../casas.module/habitaciones/entity/habitaciones.entity';
import { DelegacionEntity } from '../../../general.module/delegaciones/entity/delegaciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @Column({ type: 'varchar', nullable: false })
  apellido: string;
  @Column({ type: 'varchar', nullable: false })
  n_socio: string;
  @Column({ type: 'varchar', nullable: false })
  tel: string;
  @Column({ type: 'varchar', nullable: false })
  correo: string;

  @Column({ type: 'datetime', nullable: false })
  desde: Date;
  @Column({ type: 'datetime', nullable: false })
  hasta: Date;

  @CreateDateColumn()
  fecha_creado: Date;

  @Column({
    type: 'int',
    default: 0,
    comment: '0: Pendiente | 1: Aprobado | -1: Desaprobado',
  })
  estado: number;
  @Column({ type: 'datetime', nullable: true })
  fecha_aprobado: Date;

  @JoinColumn({ name: 'usuario_aprobador' })
  @ManyToOne(
    () => UsuarioEntity,
    (usuario_aprobador) => usuario_aprobador.reservas_aprobadas,
  )
  usuario_aprobador: UsuarioEntity;

  //! LAS DELEGACIONES, RESERVAN? O TODO VA A LA CASA MUTUAL?
  @JoinColumn({ name: 'delegacion' })
  @ManyToOne(() => DelegacionEntity, (delegacion) => delegacion.reservas)
  delegacion: DelegacionEntity;

  @JoinColumn({ name: 'habitacion' })
  @ManyToOne(() => HabitacionEntity, (habitacion) => habitacion.reservas)
  habitacion: HabitacionEntity;
}
