import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { DelegacionEntity } from 'src/general.module/delegaciones/entity/delegaciones.entity';
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

  @Column({ type: 'bool', default: false })
  aprobado: boolean;
  @Column({ type: 'datetime', nullable: true })
  fecha_aprobado: Date;

  @JoinColumn({ name: 'usuario_aprobador' })
  @ManyToOne(
    () => UsuarioEntity,
    (usuario_aprobador) => usuario_aprobador.reservas_aprovadas,
  )
  usuario_aprobador: UsuarioEntity;

  @JoinColumn({ name: 'delegacion' })
  @ManyToOne(() => DelegacionEntity, (delegacion) => delegacion.reservas)
  delegacion: DelegacionEntity;
}
