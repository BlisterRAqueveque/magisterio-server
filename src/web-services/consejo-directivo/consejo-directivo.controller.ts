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
import { ConsejoDirectivoService } from './consejo-directivo.service';
import { ConsejoDirectivoDto } from './dto/consejo-directivo.dto';
import { Response } from 'express';
import { Paginator } from '@/common';

@Controller('consejo-directivo')
export class ConsejoDirectivoController {
  constructor(private readonly service: ConsejoDirectivoService) {}

  @Post()
  async insert(@Body() data: ConsejoDirectivoDto, @Res() res: Response) {
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
    @Body() data: ConsejoDirectivoDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<ConsejoDirectivoDto>,
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
