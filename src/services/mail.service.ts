import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.pass'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: number) {
    const mailService = {
      from: this.configService.get('mail.appName'),
      to: this.configService.get('mail.recipient'),
      subject: 'Email Verification',
      html: `<p>Verification code for <b>${to}</b></p><p>token: <b>${token}</b></p>`,
    };

    await this.transporter.sendMail(mailService);
  }
}
