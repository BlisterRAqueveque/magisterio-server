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

@Entity('noticias')
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
  activo: boolean;

  @CreateDateColumn()
  fecha_creado: Date;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.noticias)
  creado_por: UsuarioEntity;

  @OneToMany(() => EdicionEntity, (ediciones) => ediciones.ediciones_noticias, {
    cascade: true,
  })
  ediciones: EdicionEntity[];
}
