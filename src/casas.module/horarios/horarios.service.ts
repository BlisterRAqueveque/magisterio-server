import { CustomPaginator, Paginator } from '@/common';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { HorarioDto } from './dto/horarios.dto';
import { HorarioEntity } from './entity/horarios.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(HorarioEntity)
    private readonly repo: Repository<HorarioDto>,
  ) {}

  async getAllFilter(paginator: CustomPaginator) {
    try {
      const { id, page, perPage, sortBy, co } = paginator;

      const conditions: FindOptionsWhere<HorarioDto> = {};

      if (id) conditions.casa_mutual = { id };

      if (co) conditions.casa_mutual = { co };

      const [result, count] = await this.repo.findAndCount({
        where: conditions,
        skip: page !== undefined ? (page - 1) * perPage : 0,
        take: perPage,
        order: {
          id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
        },
        relations: { casa_mutual: true },
      });
      return { result, count };
    } catch (err) {
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
}
