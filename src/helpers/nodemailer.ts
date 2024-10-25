import { Info } from '@/casas.module/reservas';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Mailer {
  constructor(private readonly mailer: MailerService) {}

  logger = new Logger('MAIL');

  /**
   * @description
   * Enviamos el mail
   * @param to Receptor
   * @param subject Email subject
   * @param template El template que se va a enviar (revisar templates's folder)
   * @param context Los parámetros que se envían al template (revisar template)
   */
  async sendMail(
    to: string | string[],
    subject: string,
    template: string,
    context: Partial<Info>,
  ) {
    const options: ISendMailOptions = {
      to,
      subject,
      template,
      context,
    };
    this.mailer
      .sendMail(options)
      .then((response) => {
        this.logger.log(
          `Envelope: ${JSON.stringify(response.envelope)} | Response: ${response.response}`,
        );
      })
      .catch((error) => {
        this.logger.error(`${error}`);
      });
  }
}
