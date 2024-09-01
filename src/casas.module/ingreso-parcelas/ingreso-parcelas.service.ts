import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IngresoParcelaDto } from './dto/ingreso-parcela.dto';
import {
  FindOptionsWhere,
  IsNull,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngresoParcelaEntity } from './entities/ingreso-parcela.entity';

@Injectable()
export class IngresoParcelasService {
  private readonly logger = new Logger('INGRESO PARCELA');
  constructor(
    @InjectRepository(IngresoParcelaEntity)
    private readonly repo: Repository<IngresoParcelaDto>,
  ) {}

  async create(createIngresoParcelaDto: IngresoParcelaDto) {
    try {
      if (!createIngresoParcelaDto.n_socio)
        throw new UnauthorizedException('Faltan datos');
      const result = await this.repo.save(createIngresoParcelaDto);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async findAll(page: number, perPage: number, sortBy: string) {
    try {
      const conditions: FindOptionsWhere<IngresoParcelaDto> = {};

      const [result, count] = await this.repo.findAndCount({
        where: conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
        },
        relations: {
          cerrado_por: true,
        },
        select: {
          cerrado_por: { nombre_completo: true },
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

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne({ where: { id } });
      if (!result) throw new NotFoundException('Not found');
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async update(id: number, updateIngresoParcelaDto: IngresoParcelaDto) {
    try {
      const entity = await this.repo.find({
        where: {
          parcela: { id },
          n_socio: updateIngresoParcelaDto.n_socio,
          salida_fecha: IsNull(),
        },
        order: { salida_fecha: 'DESC' },
        take: 1,
      });

      if (!entity[0]) throw new UnauthorizedException('Información no válida');

      const merge = await this.repo.merge(entity[0], updateIngresoParcelaDto);
      const result = await this.repo.save(merge);
      return result;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  async checkStatus(id: number) {
    try {
      const result = await this.repo.find({
        where: { parcela: { id } },
        order: { ingreso_fecha: 'DESC' },
        take: 1,
      });

      return result[0].salida_fecha === null ? 0 : 1;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
}
