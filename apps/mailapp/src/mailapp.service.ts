import { HttpException, Injectable } from '@nestjs/common';
import { Mailer } from './helpers/nodemailer';
import { Info } from './mailapp.controller';

@Injectable()
export class MailAppService {
  constructor(private readonly mailer: Mailer) {}

  async sendEmail(info: Info) {
    try {
      this.mailer.genericMail(
        info.correo,
        body(info),
        `Reserva ${info.estado}`,
        `Su reserva en ${info.casa_mutual} fue ${info.estado}`,
      );
    } catch (err: any) {
      console.error(err);
      throw new HttpException('Internal server error', 500);
    }
  }
}

const body = (info: Info) => {
  const mail = `
    <p>Estimado <b>${info.nombre}</b>, n° socio: ${info.n_socio}, le comentamos que su reserva: </p>
    <ul>
      <li><p><b>Casa mutual: </b>${info.casa_mutual}</p></li>
      <li><p><b>Habitación: </b>${info.habitacion}</p></li>
      <li><p><b>Días: </b>${info.reserva}</p></li>
      <li><p><b>Delegación: </b>${info.delegacion}</p></li>
      <!--<li><p><b></b></p></li>-->
    </ul>
    <p>Fue ${info.estado}</p>
  `;

  if (info.estado === 'aprobado') {
    //* poner instructivo de como proceder
  }
  return mail;
};
