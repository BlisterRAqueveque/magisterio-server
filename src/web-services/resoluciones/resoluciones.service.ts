import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ResolucionEntity } from './entity/resoluciones.entity';
import { ResolucionDto } from './dto/resoluciones.dto';
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
export class ResolucionesService {
  private readonly logger = new Logger('RESOLUCIONES');
  constructor(
    @InjectRepository(ResolucionEntity)
    private readonly repo: Repository<ResolucionDto>,
    private readonly usuarioService: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  async insert(data: ResolucionDto) {
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

  async update(data: Partial<ResolucionDto>, id: number) {
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

      const conditions: FindOptionsWhere<ResolucionDto> = {};
      if (id) conditions.id = id;
      if (nombre) conditions.resol = Like(`%${nombre}%`);

      const [result, count] = await this.repo.findAndCount({
        where: conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
        },
        relations: {
          creado_por: true,
          ediciones: true,
          articulos: true,
          consideraciones: true,
        },
        select: {
          creado_por: { nombre_completo: true },
        },
      });
      return { result, count };
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

      //* Buscamos la entidad para hacer merge
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ediciones: true },
      });

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
        relations: { creado_por: true, ediciones: true },
      });
      return entities;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async restoreDelete(id: number, data: ResolucionDto) {
    try {
      await this.repo.restore(id);
      const entity = await this.repo.findOne({
        where: { id },
        relations: { creado_por: true, ediciones: true },
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
