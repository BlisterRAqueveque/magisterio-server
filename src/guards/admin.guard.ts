import { AuthService } from '@/auth/auth.service';
import { UsuariosService } from '@/auth/usuarios/usuarios.service';
import { CustomRequest } from '@/common';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly usuarioService: UsuariosService,
  ) {}

  private readonly logger = new Logger('ADMIN GUARD');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //* Interceptamos la request del usuario
      const req: CustomRequest = context.switchToHttp().getRequest();
      //* Accedemos al headers
      const token = req.headers['authorization'].split(' ')[1];
      //* Decodificamos el token
      const decodedToken = await this.auth.verifyJwt(token);
      //* Obtenemos el usuario
      const usuario = await this.usuarioService.getUserInfo(
        decodedToken.usuario,
      );
      //* Si el usuario no es administrador, solo puede ver lo de su casa o delegación
      if (!usuario.admin) {
        //? Pasamos el objeto al request
        req.casas = usuario.casa_mutual.map((c) => c.id);
        req.delegaciones = usuario.delegacion.map((d) => d.id);
      }
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('User not found');
    }
  }
}
