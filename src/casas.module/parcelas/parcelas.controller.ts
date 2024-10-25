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
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ParcelaDto } from './dto/parcelas.dto';
import { Response } from 'express';
import { CustomRequest, Paginator } from '@/common';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly service: ParcelasService) {}

  @Post()
  async insert(@Body() data: ParcelaDto, @Res() res: Response) {
    const result = await this.service.insert(data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllFilter(
    @Query() paginator: Paginator,
    @Res() res: Response,
    @Req() req: CustomRequest,
  ) {
    paginator.casas = req.casas;
    paginator.delegaciones = req.delegaciones;
    const result = await this.service.getAllFilter(paginator);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.service.getOne(id);
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
