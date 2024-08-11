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
import { AuthService } from '../auth.service';
import { UsuarioDto } from './dto/usuarios.dto';
import { LoginUserDto, UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly service: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  /**
   * @description User's register
   */
  @Post('auth/register')
  async register(@Body() usuario: UsuarioDto, @Res() res: Response) {
    const result = await this.service.create(usuario);
    res.status(HttpStatus.CREATED).json({
      ok: true,
      result,
      msg: 'Created',
    });
  }

  @Post('auth/login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    if (body ? body.clave && body.usuario : false) {
      const result = await this.service.login(body);
      res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
    } else {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ ok: false, msg: 'No information' });
    }
  }

  @Get()
  async getAllFilter(
    @Query('id') id: number,
    @Query('usuario') usuario: string,
    @Query('correo') correo: string,
    @Query('nombre_completo') nombre_completo: string,
    @Query('casa_mutual') casa_mutual: string,
    @Query('usuario_creador') usuario_creador: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy') sortBy: string,
    @Res() res: Response,
  ) {
    const result = await this.service.getAllFilter(
      id,
      usuario,
      correo,
      nombre_completo,
      casa_mutual,
      usuario_creador,
      page,
      perPage,
      sortBy,
    );
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  /**
   * @description Return the user info. If the token is invalid, unauthorized
   * @param token
   * @param res response type
   */
  @Get('user/info')
  async getUserInfo(
    @Headers('authorization') token: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.auth.verifyJwt(token.split(' ')[1]);
      const user = await this.service.getUserInfo(result.username);
      res.status(HttpStatus.OK).json(user);
    } catch (e: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        ok: false,
        e,
        msg: 'Unauthorized',
      });
    }
  }

  @Get('entities/deletes')
  async getDeletes(@Res() res: Response) {
    const result = await this.service.getDeletes();
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put('entities/deletes/:id')
  async restoreDelete(
    @Param('id') id: number,
    @Body() data: UsuarioDto,
    @Res() res: Response,
  ) {
    const result = await this.service.restoreDelete(id, data);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Put(':id')
  async update(
    @Body() data: Partial<UsuarioDto>,
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
