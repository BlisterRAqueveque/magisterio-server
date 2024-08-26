import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsuarioDto } from '../auth/usuarios/dto/usuarios.dto';
import { UsuariosService } from '../auth/usuarios/usuarios.service';

export interface RequestModel {
  user: UsuarioDto;
  headers: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsuariosService,
  ) {}

  async use(
    req: RequestModel,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      const user = await this.userService.getUserInfoGeneratedToken(
        decodedToken.sub,
      );

      if (decodedToken) {
        if (user.id == decodedToken.sub) next();
        else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
