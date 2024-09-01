import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entity/usuarios.entity';
import {
  FindOptionsWhere,
  IsNull,
  Like,
  Not,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { UsuarioDto } from './dto/usuarios.dto';
import { AuthService } from '../auth.service';

export class LoginUserDto {
  usuario: string;
  clave: string;
}

export interface LoginResponse {
  token: {
    token: string;
    tipo_token: string;
    expira_en: number;
  };
  usuario: UsuarioDto;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('USUARIOS');
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioDto>,
    private readonly auth: AuthService,
  ) {}

  /**
   * @description get user info for compare with the generated token information
   * @param id
   * @returns
   */
  async getUserInfoGeneratedToken(id: number): Promise<UsuarioDto> {
    try {
      const result = await this.repo.findOne({
        where: { id: id },
        select: { id: true, usuario: true, clave: true },
      });
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  //? Auth methods ---------------------------------------------------------------------------->
  /**
   * @param usuario new user to create
   * @returns user information
   */
  async create(
    usuario: UsuarioDto,
  ): Promise<{ user: UsuarioDto; response: any }> {
    try {
      let response;
      const availability = await this.checkAvailability(
        usuario.correo,
        usuario.usuario,
      );

      if (!availability)
        throw new HttpException(
          'Email or Username already taken',
          HttpStatus.CONFLICT,
        );
      else {
        const hashPassword = await this.auth.hashPassword(usuario.clave);
        usuario.clave = hashPassword;
        usuario.correo = usuario.correo.toLowerCase();
        usuario.usuario = usuario.usuario.toLowerCase();
        const new_user = {
          ...(await this.repo.save(usuario)),
          password: '****',
        };
        return { user: new_user, response: response };
      }
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  /**
   * @description check new user information availability
   * @param email new user email
   * @param usuario new user username
   * @returns true if exist, false if not
   */
  async checkAvailability(correo: string, usuario: string): Promise<boolean> {
    try {
      const user = await this.repo.findOne({
        where: [{ usuario: usuario }, { correo: correo }],
      });
      return !user;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  /**
   * @description check user information for login
   * @param login_user login user information
   * @returns generated token
   */
  async login(login_user: LoginUserDto): Promise<LoginResponse | any> {
    try {
      const user = await this.getUserInfo(login_user.usuario);

      const checkPass = await this.auth.comparePassword(
        login_user.clave,
        user.clave,
      );
      if (!checkPass) throw new UnauthorizedException('Wrong credentials');
      const data: LoginResponse = {
        token: {
          token: await this.auth.generateJwt({
            ...user,
            clave: '****',
          }),
          tipo_token: 'JWT',
          expira_en: 7200000,
        },
        usuario: { ...user, clave: '****' },
      };

      return data;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  /**
   * @description returns user's info for login
   * @param username
   * @returns
   */
  async getUserInfo(usuario: string): Promise<UsuarioDto> {
    try {
      const user = await this.repo.findOne({
        where: [{ usuario: usuario }, { correo: usuario }],
        relations: {
          casa_mutual: true,
        },
      });
      if (!user) throw new NotFoundException('Not found');
      else return user;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  //? Auth methods ---------------------------------------------------------------------------->

  async getAllFilter(
    id: number,
    usuario: string,
    correo: string,
    nombre_completo: string,
    casa_mutual: string,
    usuario_creador: string,
    page: number,
    perPage: number,
    sortBy: string,
  ) {
    try {
      const conditions: FindOptionsWhere<UsuarioDto> = {};
      if (id) conditions.id = id;
      if (usuario) conditions.usuario = Like(`%${usuario}%`);
      if (correo) conditions.correo = Like(`%${correo}%`);
      if (nombre_completo)
        conditions.nombre_completo = Like(`%${nombre_completo}%`);
      if (casa_mutual)
        conditions.casa_mutual = [
          { id: +casa_mutual },
          { nombre: Like(`%${casa_mutual}%`) },
        ];
      if (usuario_creador)
        conditions.creado_por = [
          { id: +usuario_creador },
          { nombre_completo: Like(`%${usuario_creador}%`) },
        ];

      const [result, count] = await this.repo.findAndCount({
        where: conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          // ediciones: { fecha_editado: 'ASC' },
        },
        relations: { casa_mutual: true, creado_por: true, ediciones: true },
      });
      return { result, count };

      //! Creando contenido de prueba
      // const query = this.repo
      //   .createQueryBuilder('usuario')
      //   .leftJoinAndSelect('usuario.casa_mutual', 'casa_mutual')
      //   .leftJoinAndSelect('usuario.creado_por', 'creado_por')
      //   .leftJoinAndSelect('usuario.ediciones', 'ediciones');

      // if (id) {
      //   query.andWhere('usuario.id = :id', { id });
      // }

      // if (usuario) {
      //   query.andWhere('usuario.usuario LIKE :usuario', {
      //     usuario: `%${usuario}%`,
      //   });
      // }

      // if (correo) {
      //   query.andWhere('usuario.correo LIKE :correo', {
      //     correo: `%${correo}%`,
      //   });
      // }

      // if (nombre_completo) {
      //   query.andWhere('usuario.nombre_completo LIKE :nombre_completo', {
      //     nombre_completo: `%${nombre_completo}%`,
      //   });
      // }

      // if (casa_mutual) {
      //   query.andWhere(
      //     'casa_mutual.id = :casa_mutualId OR casa_mutual.nombre LIKE :casa_mutualNombre',
      //     {
      //       casa_mutualId: +casa_mutual,
      //       casa_mutualNombre: `%${casa_mutual}%`,
      //     },
      //   );
      // }

      // if (usuario_creador) {
      //   query.andWhere(
      //     'creado_por.id = :creadorId OR creado_por.nombre_completo LIKE :creadorNombre',
      //     {
      //       creadorId: +usuario_creador,
      //       creadorNombre: `%${usuario_creador}%`,
      //     },
      //   );
      // }

      // if (sortBy) {
      //   query.orderBy(
      //     'usuario.id',
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

  async update(data: Partial<UsuarioDto>, id: number) {
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

  async softDelete(id: number, token: string) {
    try {
      //* Decodificamos el token para:
      const decodedToken = await this.auth.verifyJwt(token.split(' ')[1]);
      //* obtener el usuario
      const usuario = await this.getUserInfo(decodedToken.username);
      //* Si no existe, no está autorizado
      if (!usuario) throw new UnauthorizedException('User not found');
      //* Buscamos la entidad para hacer merge
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ediciones: true, casa_mutual: true },
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

  async restoreDelete(id: number, data: UsuarioDto) {
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
