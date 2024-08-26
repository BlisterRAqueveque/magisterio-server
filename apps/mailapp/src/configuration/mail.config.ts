import { MailerOptions } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

export const mConfig: MailerOptions = {
  transport: {
    host: process.env.NODEMAILER_HOST,
    authMethod: 'PLAIN',
    //authMethod: 'LOGIN',
    secure: false,
    port: +process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  },
};
