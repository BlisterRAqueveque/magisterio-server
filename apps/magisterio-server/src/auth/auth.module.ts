import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuarios/entity/usuarios.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuard } from '../guards/auth.guard';
import { JwtStrategy } from '../strategies/auth.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], //! docker compose
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SEED'),
        signOptions: {
          expiresIn: '8h',
        },
      }),
    }),
    TypeOrmModule.forFeature([UsuarioEntity]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService, JwtStrategy, JwtGuard],
  exports: [UsuariosService, AuthService],
})
export class AuthModule {}
