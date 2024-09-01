import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '../configurations';
import { JwtGuard } from '../guards/auth.guard';
import { JwtStrategy } from '../strategies/auth.strategy';
import { AuthService } from './auth.service';
import { UsuarioEntity } from './usuarios/entity/usuarios.entity';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';

@Module({
  imports: [
    JwtModule.register({
      secret: envs.jwt_seed,
      signOptions: {
        expiresIn: '8h',
      },
    }),
    TypeOrmModule.forFeature([UsuarioEntity]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService, JwtStrategy, JwtGuard],
  exports: [UsuariosService, AuthService],
})
export class AuthModule {}
