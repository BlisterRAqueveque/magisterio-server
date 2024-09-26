import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DelegacionEntity } from './entity/delegaciones.entity';
import { DelegacionDto } from './dto/delegaciones.dto';
import { AuthService } from '@/auth/auth.service';
import { UsuariosService } from '@/auth/usuarios/usuarios.service';
import { Paginator } from '@/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  QueryFailedError,
  FindOptionsWhere,
  Like,
  Not,
  IsNull,
} from 'typeorm';

@Injectable()
export class DelegacionesService {
  private readonly logger = new Logger('DELEGACIONES');
  constructor(
    @InjectRepository(DelegacionEntity)
    private readonly repo: Repository<DelegacionDto>,
    private readonly usuarioService: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  async insert(data: DelegacionDto) {
    try {
      const entity = await this.repo.findOne({
        where: { nombre: data.nombre },
      });
      if (entity) throw new ConflictException('Already exist');
      const result = await this.repo.save(data);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async update(data: Partial<DelegacionDto>, id: number) {
    try {
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ediciones: true },
      });
      if (!entity) throw new NotFoundException('Entity not found');
      const merge = await this.repo.merge(entity, data);
      const result = await this.repo.save(merge);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async getAllFilter(paginator: Paginator) {
    try {
      const { id, nombre, page, perPage, sortBy } = paginator;
      const conditions: FindOptionsWhere<DelegacionDto> = {};
      if (id) conditions.id = id;
      if (nombre) conditions.nombre = Like(`%${nombre}%`);

      const [result, count] = await this.repo.findAndCount({
        where: conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          //ediciones: { fecha_editado: 'ASC' },
        },
        relations: {
          usuarios: true,
          creado_por: true,
          ediciones: true,
          casa_horarios: true,
        },
        select: {
          creado_por: { nombre_completo: true },
        },
      });
      return { result, count };

      //! Creando contenido de prueba
      // const query = this.repo
      //   .createQueryBuilder('casa_mutual')
      //   .leftJoinAndSelect('casa_mutual.usuarios', 'usuarios')
      //   .leftJoinAndSelect('casa_mutual.creado_por', 'creado_por')
      //   .leftJoinAndSelect('casa_mutual.ediciones', 'ediciones');

      // if (id) {
      //   query.andWhere('casa_mutual.id = :id', { id });
      // }

      // if (nombre) {
      //   query.andWhere('casa_mutual.nombre LIKE :nombre', {
      //     nombre: `%${nombre}%`,
      //   });
      // }

      // if (sortBy) {
      //   query.orderBy(
      //     'casa_mutual.id',
      //     sortBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      //   );
      //   query.addOrderBy('ediciones.fecha_editado', 'ASC');
      // }

      // query.skip(page !== undefined ? (page - 1) * perPage : 0);
      // query.take(perPage);

      // const [result, count] = await query.getManyAndCount();

      // return { result, count };
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async softDelete(id: number, token: string) {
    try {
      //* Decodificamos el token para:
      const decodedToken = await this.auth.verifyJwt(token.split(' ')[1]);
      //* obtener el usuario
      const usuario = await this.usuarioService.getUserInfo(
        decodedToken.username,
      );
      //* Si no existe, no está autorizado
      if (!usuario) throw new UnauthorizedException('User not found');
      //* Buscamos la entidad para hacer merge
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ediciones: true },
      });

      //! CO es unique, asi que para no generar conflictos, lo dejamos null
      entity.co = null;
      entity.ediciones.push({
        descripcion: `Registro eliminado por: ${usuario.nombre_completo}`,
        fecha_editado: new Date(),
      } as any);

      //* Guardamos los datos
      await this.repo.save(entity);
      //! Realizamos el softDelete
      const result = await this.repo.softDelete(id);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async getDeletes() {
    try {
      const entities = await this.repo.find({
        withDeleted: true,
        where: { borrado_el: Not(IsNull()) },
        relations: { usuarios: true, creado_por: true, ediciones: true },
      });
      return entities;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async restoreDelete(id: number, data: DelegacionDto) {
    try {
      await this.repo.restore(id);
      const entity = await this.repo.findOne({
        where: { id },
        relations: { usuarios: true, creado_por: true, ediciones: true },
      });
      const merge = await this.repo.merge(entity, data);
      const result = await this.repo.save(merge);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
}
