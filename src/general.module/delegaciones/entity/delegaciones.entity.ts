import { CasaHorarioEntity } from '@/casas.module/casa-horarios/entity/casas-horarios.entity';
import { ReservaEntity } from '../../../casas.module/reservas/entity/reservas.entity';
import { EdicionEntity } from '../../../general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '@/auth/usuarios/entity/usuarios.entity';

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
  direccion: string;
  @Column({ type: 'varchar', nullable: true })
  correo: string;
  @Column({ type: 'bool', default: true })
  activo: boolean;
  @Column({ type: 'varchar', nullable: true })
  email: string;

  @OneToMany(
    () => CasaHorarioEntity,
    (del_horarios) => del_horarios.delegacion,
    { cascade: true },
  )
  casa_horarios: CasaHorarioEntity[];

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

  @ManyToMany(() => UsuarioEntity, (usuarios) => usuarios.delegacion)
  usuarios: UsuarioEntity[];

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.carga_delegacion)
  creado_por: UsuarioEntity;
}
