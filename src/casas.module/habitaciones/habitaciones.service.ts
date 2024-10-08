import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitacionEntity } from './entity/habitaciones.entity';
import { HabitacionDto } from './dto/habitaciones.dto';
import {
  FindOptionsWhere,
  IsNull,
  Like,
  Not,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { UsuariosService } from '../../auth/usuarios/usuarios.service';
import { AuthService } from '../../auth/auth.service';
import { Paginator } from '@/common';

@Injectable()
export class HabitacionesService {
  private readonly logger = new Logger('HABITACIONES');
  constructor(
    @InjectRepository(HabitacionEntity)
    private readonly repo: Repository<HabitacionDto>,
    private readonly usuarioService: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  async insert(data: HabitacionDto) {
    try {
      const result = await this.repo.save(data);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async update(data: Partial<HabitacionDto>, id: number) {
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

      const conditions: FindOptionsWhere<HabitacionDto> = {};
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
        relations: { creado_por: true, ediciones: true, casa_mutual: true },
        select: {
          creado_por: { nombre_completo: true },
        },
      });
      return { result, count };

      //! Creando contenido de prueba
      //   const query = this.repo
      //     .createQueryBuilder('habitacion')
      //     .leftJoinAndSelect('habitacion.creado_por', 'creado_por')
      //     .leftJoinAndSelect('habitacion.ediciones', 'ediciones')
      //     .leftJoinAndSelect('habitacion.casa_mutual', 'casa_mutual');

      //   if (id) {
      //     query.andWhere('habitacion.id = :id', { id });
      //   }

      //   if (nombre) {
      //     query.andWhere('habitacion.nombre LIKE :nombre', {
      //       nombre: `%${nombre}%`,
      //     });
      //   }

      //   if (sortBy) {
      //     query.orderBy(
      //       'habitacion.id',
      //       sortBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      //     );
      //   }

      //   query.skip(page !== undefined ? (page - 1) * perPage : 0);
      //   query.take(perPage);

      //   const [result, count] = await query.getManyAndCount();

      //   return { result, count };
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
        relations: { casa_mutual: true, creado_por: true, ediciones: true },
      });
      return entities;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async restoreDelete(id: number, data: HabitacionDto) {
    try {
      await this.repo.restore(id);
      const entity = await this.repo.findOne({
        where: { id },
        relations: { casa_mutual: true, creado_por: true, ediciones: true },
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
