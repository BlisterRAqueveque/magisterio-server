import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entity/usuarios.entity';
import { Repository } from 'typeorm';
import { UsuarioDto } from './dto/usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioDto>,
  ) {}

  /**
   * @description get user info for compare with the generated token information
   * @param id
   * @returns
   */
  async getUserInfoGeneratedToken(id: string): Promise<UsuarioDto> {
    try {
      const result = await this.repo.findOne({
        where: { id: id },
        select: { id: true, usuario: true, clave: true },
      });
      return result;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
