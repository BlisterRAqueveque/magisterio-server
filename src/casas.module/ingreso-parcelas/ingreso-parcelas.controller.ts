import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { IngresoParcelaDto } from './dto/ingreso-parcela.dto';
import { IngresoParcelasService } from './ingreso-parcelas.service';

@Controller('ingreso-parcelas')
export class IngresoParcelasController {
  constructor(private readonly service: IngresoParcelasService) {}

  @Post()
  async create(
    @Body() createIngresoParcelaDto: IngresoParcelaDto,
    @Res() res: Response,
  ) {
    const result = await this.service.create(createIngresoParcelaDto);
    res.status(HttpStatus.CREATED).json({ ok: true, result, msg: 'created' });
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy') sortBy: string,
    @Res() res: Response,
  ) {
    const result = await this.service.findAll(page, perPage, sortBy);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const result = await this.service.findOne(id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngresoParcelaDto: IngresoParcelaDto,
    @Res() res: Response,
  ) {
    const result = await this.service.update(id, updateIngresoParcelaDto);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get('entity/status/:id')
  async checkStatus(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const result = await this.service.checkStatus(id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
}
