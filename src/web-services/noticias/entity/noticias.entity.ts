import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class NoticiaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  background: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  news: string;

  @Column({ type: 'bool', default: true })
  active: boolean;

  @CreateDateColumn()
  fecha_creado: Date;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.noticias)
  creado_por: UsuarioEntity;

  @OneToMany(() => EdicionEntity, (ediciones) => ediciones.ediciones_noticias)
  ediciones: EdicionEntity[];
}
