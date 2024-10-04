import { CustomPaginator } from '@/common';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Get()
  async getAllFilter(
    @Query() paginator: CustomPaginator,
    @Res() res: Response,
  ) {
    const result = await this.service.getAllFilter(paginator);

    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }
}
