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
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Query('nombre') nombre: string,
    @Query('n_socio') n_socio: string,
    @Query('correo') correo: string,
    @Query('estado') estado: number,
    @Query('fecha_creado') fecha_creado: string,
    @Query('usuario_aprobador') usuario_aprobador: string,
    @Query('casa_mutual') casa_mutual: string,
    @Query('delegacion') delegacion: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy') sortBy: string,
    @Res() res: Response,
  ) {
    const result = await this.service.getAllFilter(
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
    );
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
