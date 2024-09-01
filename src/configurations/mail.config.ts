import { MailerOptions } from '@nestjs-modules/mailer';
import { envs } from './envs';

export const mConfig: MailerOptions = {
  transport: {
    host: envs.mail_host,
    authMethod: 'PLAIN',
    //authMethod: 'LOGIN',
    secure: false,
    port: envs.mail_port,
    auth: {
      user: envs.mail_user,
      pass: envs.mail_pass,
    },
  },
};
