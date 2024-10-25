import { MailerOptions } from '@nestjs-modules/mailer';
import { envs } from './envs';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TEMPLATE_DIR } from '@/common';

export const mConfig: MailerOptions = {
  transport: {
    host: envs.mail_host,
    // authMethod: 'PLAIN',
    // authMethod: 'LOGIN',
    secure: true,
    port: envs.mail_port,
    auth: {
      user: envs.mail_user,
      pass: envs.mail_pass,
    },
  },
  defaults: {
    from: envs.mail_from,
  },
  template: {
    dir: join(__dirname, '..', TEMPLATE_DIR),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
