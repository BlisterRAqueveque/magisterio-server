import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  Headers,
} from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ParcelaDto } from './dto/parcelas.dto';
import { Response } from 'express';

@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly service: ParcelasService) {}

  @Post()
  async insert(@Body() data: ParcelaDto, @Res() res: Response) {
    const result = await this.service.insert(data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get()
  async getAllFilter(
    @Query('id') id: number,
    @Query('nombre') nombre: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy') sortBy: string,
    @Res() res: Response,
  ) {
    const result = await this.service.getAllFilter(
      id,
      nombre,
      page,
      perPage,
      sortBy,
    );
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
    @Body() data: ParcelaDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<ParcelaDto>,
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
