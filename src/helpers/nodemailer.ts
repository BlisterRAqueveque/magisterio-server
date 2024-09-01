import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Mailer {
  private readonly logger = new Logger('MAILER');

  constructor(private readonly mailerService: MailerService) {}

  async genericMail(
    to: string[] | string,
    body: string,
    title: string,
    subject?: string,
  ) {
    try {
      const response = await this.mailerService.sendMail({
        bcc: to,
        from: 'user-a1764d03-3d00-4dfb-b7bf-ac99a976568d@mailslurp.net',
        subject: subject ? subject : 'Información importante',
        html: mail(body, title),
      });
      return response;
    } catch (e: any) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}

export const mail = (body: string, title: string) => {
  return `
    <!DOCTYPE html>
          <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Mutual Magisterio</title>
                  <style>
                      body {
                          margin: 0;
                          padding: 0;
                           
                          line-height: 1.6;
                      }
                      * {
                          font-family: 'Roboto', sans-serif;
                      }
                  </style>
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
              </head>
              <body>
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tbody>
              <tr>
              <td style="padding: 10px 0 30px 0;">
                  <table style="border: 1px solid #cccccc; border-collapse:
                  collapse;" width="600" cellspacing="0" cellpadding="0"
                  border="0" align="center">
                  <tbody>
                      <tr>
                      <td style="padding: 10px 0 0px 0; color: white;
                          font-size: 28px;  "
                          bgcolor="#481600" align="center"> <b>Mutual</b><br>
                          <b style="font-size: 22px;">Magisterio</b>
                      </td>
                      </tr>
                      <tr>
                      <td style="padding: 40px 30px 20px 30px;"
                          bgcolor="#ffffff">
                          <table width="100%" cellspacing="0"
                          cellpadding="0" border="0">
                          <tbody>
                              <tr>
                              <td style="color: #153643; font-size: 20px;
                                  text-align: center;"> <b>${title}</b> </td>
                              </tr>
                              <tr>
                              <td style="padding: 20px 0 10px 0; color:
                                  #153643;  
                                  font-size: 16px; line-height: 20px;">
                                  ${body}
                                  <p><small>Por favor, no responda a este
                                      correo.</small></p>
                                  <p style="font-size: .8rem; text-align: end;color:red"><cite><small></small>Estamos migrando a una nueva experiencia.</small></cite></p>
                              </td>
                              </tr>
                          </tbody>
                          </table>
                      </td>
                      </tr>
                      <tr>
                      <td style="padding: 15px 30px 15px 30px;"
                          bgcolor="#1D232A">
                          <table width="100%" cellspacing="0"
                          cellpadding="0" border="0">
                          <tbody>
                              <tr>
                              <td style="color: #ffffff; font-size: 14px;
                                  padding-right: 10px;" width="75%"><br>
                              </td>
                              <td width="25%" align="right">
                                  <table cellspacing="0" cellpadding="0"
                                  border="0">
                                  <tbody>
                                      <tr>
                                      <td style="font-size: 12px;
                                          font-weight: bold;
                                          padding-right:20px;"> <a
                                          href=""
                                          style="color: #ffffff;"
                                          moz-do-not-send="true"> Soporte
                                          </a> </td>
                                      <td style="font-size: 0;
                                          line-height: 0;" width="20"> </td>
                                      <td style="font-size: 12px;
                                          font-weight: bold;"> <a href="https://www.hvdevs.com/"
                                          style="color: #ffffff;" target="_blank"
                                          moz-do-not-send="true"> HVDevs
                                          </a> </td>
                                      </tr>
                                  </tbody>
                                  </table>
                              </td>
                              </tr>
                          </tbody>
                          </table>
                      </td>
                      </tr>
                  </tbody>
                  </table>
              </td>
              </tr>
          </tbody>
      </table>
    </body>
</html>
      `;
};
