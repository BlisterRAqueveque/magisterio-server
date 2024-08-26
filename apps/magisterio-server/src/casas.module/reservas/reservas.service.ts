import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ReservaDto } from './dto/reservas.dto';
import { ReservaEntity } from './entity/reservas.entity';
import { ClientProxy } from '@nestjs/microservices';
import { formatDate } from '../../tools/dates';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly repo: Repository<ReservaDto>,
    @Inject('MAIL_SERVICE') private readonly clientMail: ClientProxy, //MICROSERVICIO
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
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async getAllFilter(
    desde: string,
    hasta: string,
    nombre: string,
    n_socio: string,
    correo: string,
    estado: number,
    fecha_creado: string,
    usuario_aprobador: string,
    casa_mutual: string,
    delegacion: string,
    page: number,
    perPage: number,
    sortBy: string,
  ) {
    try {
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
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
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
        return result;
      } else {
        throw new UnauthorizedException('nothing to save');
      }
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async update(data: Partial<ReservaDto>, id: number) {
    try {
      const entity = await this.repo.findOne({
        where: { id },
        relations: { habitacion: { casa_mutual: true }, delegacion: true },
      });
      if (!entity) throw new NotFoundException('Entity not found');
      const approved = entity.estado === 0 && data.estado === 1;
      const disapproved = entity.estado === 0 && data.estado === -1;
      const merge = await this.repo.merge(entity, data);
      const result = await this.repo.save(merge);
      if (approved || disapproved) this.sendMail(approved, disapproved, entity);
      return result;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
  sendMail(approved: boolean, disapproved: boolean, data: ReservaDto) {
    const estado = approved
      ? 'aprobada'
      : disapproved
        ? 'desaprobada'
        : 'indefinido';
    const info = {
      estado,
      correo: data.correo,
      nombre: `${data.nombre} ${data.apellido}`,
      n_socio: data.n_socio,
      delegacion: data.delegacion ? data.delegacion : 'No tiene',
      habitacion: data.habitacion ? data.habitacion.nombre : 'No tiene',
      casa_mutual: data.habitacion
        ? data.habitacion.casa_mutual
          ? data.habitacion.casa_mutual.nombre
          : 'No tiene'
        : 'No tiene',
      reserva: `desde: ${formatDate(data.desde as any)}, hasta: ${formatDate(data.hasta as any)}`,
    };
    //TRABAJAMOS CON EVENT EMITTERS => 
    this.clientMail.emit('send_mail', info);
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
