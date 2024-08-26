import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly auth: AuthService) {}
  @Get()
  sendStatus(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ msg: 'Server status: OK' });
  }

  @Put()
  async check(@Body() data: { token: string }, @Res() res: Response) {
    try {
      const ok = await this.auth.verifyJwt(data.token);
      if (ok) res.status(HttpStatus.OK).json({ ok: true, msg: 'Ok' });
      else
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ ok: false, msg: 'Unauthorized' });
    } catch (err: any) {
      console.error(err);
      throw new HttpException('Invalid token', 404);
    }
  }
}
