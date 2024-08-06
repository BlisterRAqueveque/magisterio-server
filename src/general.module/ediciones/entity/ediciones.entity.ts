import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { HabitacionEntity } from 'src/casas.module/habitaciones/entity/habitaciones.entity';
import { ParcelaEntity } from 'src/casas.module/parcelas/entity/parcelas.entity';
import { DelegacionEntity } from 'src/general.module/delegaciones/entity/delegaciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ediciones')
export class EdicionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'text', nullable: true })
  descripcion: string;
  @CreateDateColumn()
  fecha_editado: Date;

  @JoinColumn({ name: 'ediciones_usuarios' })
  @ManyToOne(
    () => UsuarioEntity,
    (ediciones_usuarios) => ediciones_usuarios.ediciones,
  )
  ediciones_usuarios: UsuarioEntity;

  @JoinColumn({ name: 'ediciones_casa_mutual' })
  @ManyToOne(
    () => CasaMutualEntity,
    (ediciones_casa_mutual) => ediciones_casa_mutual.ediciones,
  )
  ediciones_casa_mutual: CasaMutualEntity;

  @JoinColumn({ name: 'ediciones_habitaciones' })
  @ManyToOne(
    () => HabitacionEntity,
    (ediciones_habitaciones) => ediciones_habitaciones.ediciones,
  )
  ediciones_habitaciones: HabitacionEntity;

  @JoinColumn({ name: 'ediciones_delegaciones' })
  @ManyToOne(
    () => DelegacionEntity,
    (ediciones_delegaciones) => ediciones_delegaciones.ediciones,
  )
  ediciones_delegaciones: DelegacionEntity;

  @JoinColumn({ name: 'ediciones_parcelas' })
  @ManyToOne(
    () => ParcelaEntity,
    (ediciones_parcelas) => ediciones_parcelas.ediciones,
  )
  ediciones_parcelas: ParcelaEntity;

}
