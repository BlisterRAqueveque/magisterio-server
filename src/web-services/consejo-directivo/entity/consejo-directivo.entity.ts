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

@Entity('consejo_directivo')
export class ConsejoDirectivoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  cargo: string;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  nombre: string;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  n_socio: string;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  dni: string;

  @Column({ type: 'bool', default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_carga: Date;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(
    () => UsuarioEntity,
    (creado_por) => creado_por.consejos_directivos,
  )
  creado_por: UsuarioEntity;

  @OneToMany(
    () => EdicionEntity,
    (ediciones) => ediciones.ediciones_consejo_directivo,
    { cascade: true },
  )
  ediciones: EdicionEntity[];
}
