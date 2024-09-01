import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsuarioDto } from './usuarios/dto/usuarios.dto';

@Injectable()
export class AuthService {
  //* User's methods || Login & Register
  constructor(private jwtService: JwtService) {}

  /**
   * @param user find user from database
   * @returns generated jwt
   */
  async generateJwt(user: UsuarioDto): Promise<string> {
    /**
     * @return: user.id, user.nickname
     * @description This params are for navigational permissions inside the API.
     *              Destructuring the token, gets the information.
     */
    const payload = {
      sub: user.id,
      username: user.usuario,
      name: user.nombre,
      last_name: user.apellido,
      //TODO Agregar el distrito la que pertenece
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * @param user find user from database
   * @returns generated jwt
   */
  async generateJwtRestorePassword(user: UsuarioDto): Promise<string> {
    /**
     * @return: user.id, user.nickname
     * @description This params are for navigational permissions inside the API.
     *              Destructuring the token, gets the information.
     */
    const payload = {
      sub: user.id,
      pass: user.clave,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * @param password new user's password
   * @returns hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * @description compares the login password with the stored
   * @param password input password
   * @param hashPassword stored user's password
   * @returns boolean
   */
  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  /**
   * @description compare user session jwt
   * @param jwt jwt from client
   * @returns boolean
   */
  async verifyJwt(jwt: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(jwt);
    } catch (error) {
      return null;
    }
  }

  /**
   *
   * @param token token to compare
   * @returns if token = token.type, return true, else false
   */
  isJwt(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      const header = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8'),
      );
      return !!header;
    } catch (error) {
      return false;
    }
  }
}
