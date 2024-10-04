import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ParcelaEntity } from './entity/parcelas.entity';
import { ParcelaDto } from './dto/parcelas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { UsuariosService } from '../../auth/usuarios/usuarios.service';
import {
  Repository,
  FindOptionsWhere,
  Like,
  Not,
  IsNull,
  QueryFailedError,
} from 'typeorm';
import { Paginator } from '@/common';

@Injectable()
export class ParcelasService {
  private readonly logger = new Logger('PARCELAS');
  constructor(
    @InjectRepository(ParcelaEntity)
    private readonly repo: Repository<ParcelaDto>,
    private readonly usuarioService: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  async insert(data: ParcelaDto) {
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

  async update(data: Partial<ParcelaDto>, id: number) {
    try {
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ediciones: true, ingresos: true },
      });
      if (!entity) throw new NotFoundException('Entity not found');
      if (data.activo === false) {
        entity.ingresos.forEach((i) => {
          if (i.salida_fecha === null) i.salida_fecha = new Date();
        });
      }
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

      const conditions: FindOptionsWhere<ParcelaDto> = {};
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
          creado_por: true,
          ediciones: true,
          casa_mutual: true,
          ingresos: true,
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

  async getOne(id: number) {
    try {
      const result = await this.repo.findOne({  
        where: { id },
        relations: { casa_mutual: true },
      });
      if (!result) throw new NotFoundException('Entity not found');
      return result;
    } catch (err) {
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
        relations: { ediciones: true, ingresos: true },
      });

      entity.ingresos.forEach((i) => {
        if (i.salida_fecha === null) i.salida_fecha = new Date();
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
        relations: { creado_por: true, ediciones: true, casa_mutual: true },
      });
      return entities;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async restoreDelete(id: number, data: ParcelaDto) {
    try {
      await this.repo.restore(id);
      const entity = await this.repo.findOne({
        where: { id },
        relations: { creado_por: true, ediciones: true, casa_mutual: true },
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
