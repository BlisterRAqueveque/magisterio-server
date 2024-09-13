import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Response } from 'express';
import { ReservaDto } from './dto/reservas.dto';
import { ReservaPaginator } from './dto/reservas.paginator.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Get('room/:id')
  async getByRoom(@Param('id') id: number, @Res() res: Response) {
    const result = await this.service.getByRoom(id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Post()
  async insert(@Body() data: ReservaDto, @Res() res: Response) {
    const result = await this.service.insert(data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get()
  async getAllFilter(
    @Query() paginator: ReservaPaginator,
    @Res() res: Response,
  ) {
    const result = await this.service.getAllFilter(paginator);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<ReservaDto>,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.service.update(data, id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
}
