import { Paginator } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { NoticiaDto } from './dto/noticias.dto';
import { NoticiasService } from './noticias.service';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly service: NoticiasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async insert(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any,
    @Res() res: Response,
  ) {
    try {
      const form: NoticiaDto = JSON.parse(data.form);
      form.background = file.filename;
      const result = await this.service.insert(form);
      res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, e, msg: 'Controller error' });
    }
  }

  @Get()
  async getAllFilter(@Query() paginator: Paginator, @Res() res: Response) {
    const result = await this.service.getAllFilter(paginator);

    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
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
    @Body() data: NoticiaDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<NoticiaDto>,
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
