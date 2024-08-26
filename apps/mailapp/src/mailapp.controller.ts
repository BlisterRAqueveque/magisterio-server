import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailAppService } from './mailapp.service';

export interface Info {
  estado: string;
  correo: string;
  nombre: string;
  n_socio: string;
  delegacion: string;
  habitacion: string;
  casa_mutual: string;
  reserva: string;
}

@Controller()
export class MailAppController {
  constructor(private readonly mailAppService: MailAppService) {}

  /**
   * @description Ahora el controlador, como no esta el puerto expuesto, se encarga de escuchar eventos solamente
   */
  @EventPattern('send_mail') // => LOS DECORADORES GET POST ETC SE CAMBIAN POR EL EVENT PATTERN
  async sendMail(info: Info) {
    this.mailAppService.sendEmail(info);
  }
}
