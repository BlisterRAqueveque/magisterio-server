import { Module } from '@nestjs/common';
import { MailAppController } from './mailapp.controller';
import { MailAppService } from './mailapp.service';
import { mConfig } from './configuration/mail.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Mailer } from './helpers/nodemailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot(mConfig),
  ],
  controllers: [MailAppController],
  providers: [MailAppService, Mailer],
})
export class MailAppModule {
  constructor() {
    console.log(process.env.NODEMAILER_USER)
  }
}
