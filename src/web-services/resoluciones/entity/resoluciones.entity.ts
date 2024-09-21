import { UsuarioEntity } from '@/auth/usuarios/entity/usuarios.entity';
import { EdicionEntity } from '@/general.module/ediciones/entity/ediciones.entity';
import { ArticuloEntity } from '@/web-services/articulos/entity/articulos.entity';
import { ConsideracionEntity } from '@/web-services/consideraciones/entity/consideraciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resoluciones')
export class ResolucionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  resol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lugar: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fecha: string;

  @Column({ type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'text', nullable: true })
  visto: string;

  @OneToMany(
    () => ConsideracionEntity,
    (consideraciones) => consideraciones.resolucion,
    { cascade: true },
  )
  consideraciones: ConsideracionEntity[];

  @CreateDateColumn()
  fecha_carga: Date;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.resoluciones)
  creado_por: UsuarioEntity;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_resolucion,
    { cascade: true },
  )
  ediciones: EdicionEntity[];

  @OneToMany(() => ArticuloEntity, (articulos) => articulos.resolucion, {
    cascade: true,
  })
  articulos: ArticuloEntity[];
}
