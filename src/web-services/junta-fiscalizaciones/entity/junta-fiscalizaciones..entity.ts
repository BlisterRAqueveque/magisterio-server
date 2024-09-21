import { UsuarioEntity } from '@/auth/usuarios/entity/usuarios.entity';
import { EdicionEntity } from '@/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('junta_fiscalizaciones')
export class JuntaFiscalizacionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  cargo: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  n_socio: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  dni: string;
  @Column({ type: 'bool', default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_carga: Date;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(
    () => UsuarioEntity,
    (creado_por) => creado_por.junta_fiscalizaciones,
  )
  creado_por: UsuarioEntity;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_junta_fiscalizacion,
    { cascade: true },
  )
  ediciones: EdicionEntity[];
}
