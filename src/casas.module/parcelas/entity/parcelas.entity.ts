import { UsuarioEntity } from 'src/auth/usuarios/entity/usuarios.entity';
import { CasaMutualEntity } from 'src/casas.module/casas-mutuales/entity/casas-mutuales.entity';
import { EdicionEntity } from 'src/general.module/ediciones/entity/ediciones.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('parcelas')
export class ParcelaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @CreateDateColumn()
  fecha_creado: Date;
  @Column({ type: 'bool', default: true })
  activo: boolean;

  @DeleteDateColumn()
  borrado_el: Date;

  @ManyToOne(() => UsuarioEntity, (creado_por) => creado_por.parcelas)
  creado_por: UsuarioEntity;

  @JoinColumn({ name: 'casa_mutual' })
  @ManyToOne(() => CasaMutualEntity, (casa_mutual) => casa_mutual.parcelas)
  casa_mutual: CasaMutualEntity;

  @OneToMany(() => EdicionEntity, (ediciones) => ediciones.ediciones_parcelas, {
    cascade: true,
  })
  ediciones: EdicionEntity[];
}
