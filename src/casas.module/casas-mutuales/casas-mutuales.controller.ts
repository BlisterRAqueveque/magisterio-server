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
  Headers,
  Res,
} from '@nestjs/common';
import { CasasMutualesService } from './casas-mutuales.service';
import { CasaMutualDto } from './dto/casas-mutuales.dto';
import { Response } from 'express';

@Controller('casas-mutuales')
export class CasasMutualesController {
  constructor(private readonly service: CasasMutualesService) {}

  @Post()
  async insert(@Body() data: CasaMutualDto, @Res() res: Response) {
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
    @Body() data: CasaMutualDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<CasaMutualDto>,
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

  //! APP METHODS ------------------------------------------------------------>
  @Get('get-all/habitaciones')
  async getCasasMutualesAndHabitaciones(@Res() res: Response) {
    const result = await this.service.getCasasMutualesAndHabitaciones();
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
  //! APP METHODS ------------------------------------------------------------>
}
