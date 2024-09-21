import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ResolucionesService } from './resoluciones.service';
import { ResolucionDto } from './dto/resoluciones.dto';
import { Paginator } from '@/common';
@Controller('resoluciones')
export class ResolucionesController {
  constructor(private readonly service: ResolucionesService) {}

  @Post()
  async insert(@Body() data: ResolucionDto, @Res() res: Response) {
    const result = await this.service.insert(data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get()
  async getAllFilter(@Query() paginator: Paginator, @Res() res: Response) {
    const result = await this.service.getAllFilter(paginator);

    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Get('entities/deletes')
  async getDeletes(@Res() res: Response) {
    const result = await this.service.getDeletes();
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put('entities/deletes/:id')
  async restoreDelete(
    @Param('id') id: number,
    @Body() data: ResolucionDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<ResolucionDto>,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.service.update(data, id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Delete(':id')
  async softDelete(
    @Headers('authorization') token: string,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.service.softDelete(id, token);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
}
