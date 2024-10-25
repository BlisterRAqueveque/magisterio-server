import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Mailer } from '../../helpers';
import { ReservaDto } from './dto/reservas.dto';
import { ReservaEntity } from './entity/reservas.entity';
import { formatDate } from '../../tools';
import { ReservaPaginator } from './dto/reservas.paginator.dto';
import { Info } from './dto/reservas.info';

@Injectable()
export class ReservasService {
  private readonly logger = new Logger('RESERVAS');
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly repo: Repository<ReservaDto>,
    private readonly mailer: Mailer,
  ) {}

  async getByRoom(id_room: number) {
    try {
      const aprobados = await this.repo.find({
        where: { habitacion: { id: id_room }, estado: 1 }, //! Estado solo aprobados
        order: { id: 'ASC' },
      });

      const en_espera = await this.repo.find({
        where: { habitacion: { id: id_room }, estado: 0 }, //! Estado solo aprobados
        order: { id: 'ASC' },
      });
      return { aprobados, en_espera };
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async getAllFilter(paginator: ReservaPaginator) {
    try {
      const {
        desde,
        hasta,
        nombre,
        n_socio,
        correo,
        estado,
        fecha_creado,
        usuario_aprobador,
        casa_mutual,
        delegacion,
        page,
        perPage,
        sortBy,
        casas,
      } = paginator;

      const condition: FindOptionsWhere<ReservaDto> = {};
      const conditions: FindOptionsWhere<ReservaDto>[] = [];

      if (desde && !hasta) condition.desde = MoreThanOrEqual(new Date(desde));
      else if (desde && hasta) {
        condition.desde = MoreThanOrEqual(new Date(desde));
        condition.hasta = LessThanOrEqual(new Date(hasta));
      } else if (!desde && hasta)
        condition.hasta = LessThanOrEqual(new Date(hasta));

      if (n_socio) condition.n_socio = Like(`%${n_socio}%`);
      if (correo) condition.correo = Like(`%${correo}%`);
      if (estado !== undefined) {
        condition.estado = +estado;
      }
      if (fecha_creado) {
        const date = new Date(fecha_creado);
        date.setDate(1);
        condition.fecha_creado = Between(new Date(fecha_creado), date);
      }
      if (usuario_aprobador)
        condition.usuario_aprobador = [
          { id: +usuario_aprobador },
          { nombre_completo: Like(`%${usuario_aprobador}%`) },
        ];
      if (casa_mutual)
        condition.habitacion = {
          casa_mutual: [
            { id: +casa_mutual },
            { nombre: Like(`%${casa_mutual}%`) },
          ],
        };
      if (delegacion)
        condition.delegacion = [
          { id: +delegacion },
          { nombre: Like(`%${delegacion}%`) },
        ];

      if (nombre) {
        conditions.push(
          condition,
          { nombre: Like(`%${nombre}%`) },
          { apellido: Like(`%${nombre}%`) },
        );
      }
      //! Este filtro es para solo se vean las casas asignadas de los usuarios
      if (casas) condition.habitacion = { casa_mutual: { id: In(casas) } };

      const [result, count] = await this.repo.findAndCount({
        where: conditions.length === 0 ? condition : conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          //ediciones: { fecha_editado: 'ASC' },
        },
        relations: {
          habitacion: { casa_mutual: true },
          usuario_aprobador: true,
          delegacion: true,
        },
        select: {
          usuario_aprobador: { id: true, nombre_completo: true },
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
        relations: { delegacion: true, habitacion: { casa_mutual: true } },
      });

      if (!result) throw new NotFoundException('Entity not found');

      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async insert(data: ReservaDto) {
    try {
      if (this.checkItem(data)) {
        const desde = new Date(data.desde);
        desde.setHours(0, 0, 0, 0);

        const hasta = new Date(data.hasta);
        hasta.setHours(23, 59, 59, 999);

        const entity = await this.repo.findOne({
          where: [
            {
              desde: Between(desde, hasta),
              delegacion: { id: data.delegacion ? data.delegacion.id : null },
              habitacion: { id: data.habitacion.id },
              estado: 1,
            },
            {
              hasta: Between(desde, hasta),
              delegacion: { id: data.delegacion ? data.delegacion.id : null },
              habitacion: { id: data.habitacion.id },
              estado: 1,
            },
          ],
        });
        if (entity) throw new ConflictException('Has reserva');
        const result = await this.repo.save(data);

        this.prepareEmailUpload(result.id);

        return result;
      } else {
        throw new UnauthorizedException('nothing to save');
      }
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  async prepareEmailUpload(id: number) {
    try {
      const entity = await this.getOne(id);

      const {
        correo,
        nombre,
        apellido,
        n_socio,
        habitacion,
        fecha_aprobado,
        desde,
        hasta,
      } = entity;

      //* Obtenemos el template
      const template = 'pendiente';

      /** Creamos la info */
      const info: Info = {
        template,
        correo,
        nombre: `${nombre} ${apellido}`,
        n_socio,
        delegacion: habitacion
          ? habitacion.casa_mutual
            ? habitacion.casa_mutual.nombre
            : 'No tiene'
          : 'No tiene',
        habitacion: habitacion ? habitacion.nombre : 'No tiene',
        fecha_aprobado: formatDate(fecha_aprobado as any),
        desde: formatDate(desde as any),
        hasta: formatDate(hasta as any),
        servicios: habitacion ? habitacion.servicios : [],
        fecha: formatDate(new Date().toDateString()),
      };

      this.sendEmail(info);
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async update(data: Partial<ReservaDto>, id: number) {
    try {
      const entity = await this.getOne(id);

      const approved = entity.estado === 0 && data.estado === 1;

      const disapproved = entity.estado === 0 && data.estado === -1;

      const merge = await this.repo.merge(entity, data);

      const result = await this.repo.save(merge);

      if (approved || disapproved)
        this.prepareEmailUpdate(approved, disapproved, entity);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  prepareEmailUpdate(
    approved: boolean,
    disapproved: boolean,
    data: ReservaDto,
  ) {
    const {
      correo,
      nombre,
      apellido,
      n_socio,
      habitacion,
      fecha_aprobado,
      desde,
      hasta,
    } = data;

    //* Obtenemos el template
    const template = approved
      ? 'aprobada'
      : disapproved
        ? 'desaprobada'
        : 'indefinido';

    /** Creamos la info */
    const info: Info = {
      template,
      correo,
      nombre: `${nombre} ${apellido}`,
      n_socio,
      delegacion: habitacion
        ? habitacion.casa_mutual
          ? habitacion.casa_mutual.nombre
          : 'No tiene'
        : 'No tiene',
      habitacion: habitacion ? habitacion.nombre : 'No tiene',
      fecha_aprobado: formatDate(fecha_aprobado as any),
      desde: formatDate(desde as any),
      hasta: formatDate(hasta as any),
      servicios: habitacion ? habitacion.servicios : [],
      fecha: formatDate(new Date().toDateString()),
    };

    this.sendEmail(info);
  }

  async sendEmail(info: Info) {
    try {
      const { correo, template, ...context } = info;
      this.mailer.sendMail(
        correo,
        'Notificación ReservaDto, Mutual Magisterio',
        template,
        context,
      );
    } catch (err: any) {
      this.logger.error(err);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description
   * Se asegura que el item tenga toda la información
   */
  private checkItem(data: ReservaDto) {
    return (
      data.apellido &&
      data.n_socio &&
      data.nombre &&
      data.tel &&
      data.correo &&
      data.desde &&
      data.hasta &&
      data.habitacion
    );
  }
}
