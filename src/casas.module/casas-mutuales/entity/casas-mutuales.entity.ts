import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { HabitacionEntity } from 'src/casas.module/habitaciones/entity/habitaciones.entity';
import { ParcelaEntity } from 'src/casas.module/parcelas/entity/parcelas.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('casas_mutuales')
export class CasaMutualEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @CreateDateColumn()
  fecha_creado: Date;

  @OneToMany(() => UsuarioEntity, (usuarios) => usuarios.casa_mutual)
  usuarios: UsuarioEntity[];

  @OneToMany(() => HabitacionEntity, (habitaciones) => habitaciones.casa_mutual)
  habitaciones: HabitacionEntity[];

  @OneToMany(() => ParcelaEntity, (parcelas) => parcelas.casa_mutual)
  parcelas: ParcelaEntity[];

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_casa_mutual,
  )
  ediciones: EdicionEntity[];
}
