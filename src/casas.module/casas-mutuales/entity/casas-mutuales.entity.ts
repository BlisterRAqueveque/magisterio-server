import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { HabitacionEntity } from 'src/casas.module/habitaciones/entity/habitaciones.entity';
import { HorarioEntity } from 'src/casas.module/horarios/entity/horarios.entity';
import { ParcelaEntity } from 'src/casas.module/parcelas/entity/parcelas.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
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

@Entity('casas_mutuales')
export class CasaMutualEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'int', nullable: true, unique: true })
  co: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @Column({ type: 'varchar', nullable: true })
  direccion: string;
  @Column({ type: 'varchar', nullable: true })
  tel: string;
  @Column({ type: 'varchar', nullable: true })
  cel: string;
  @Column({ type: 'varchar', nullable: true })
  correo: string;
  @Column({ type: 'int', default: 0 })
  cp: number;
  @CreateDateColumn()
  fecha_creado: Date;
  @Column({ type: 'bool', default: true })
  activo: boolean;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.carga_casa_mutual)
  creado_por: UsuarioEntity;

  @ManyToMany(() => UsuarioEntity, (usuarios) => usuarios.casa_mutual)
  usuarios: UsuarioEntity[];

  @OneToMany(() => HabitacionEntity, (habitaciones) => habitaciones.casa_mutual)
  habitaciones: HabitacionEntity[];

  @OneToMany(() => ParcelaEntity, (parcelas) => parcelas.casa_mutual)
  parcelas: ParcelaEntity[];

  @OneToMany(() => HorarioEntity, (horarios) => horarios.casa_mutual)
  horarios: HorarioEntity[];

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_casa_mutual,
    { cascade: true },
  )
  ediciones: EdicionEntity[];
}
