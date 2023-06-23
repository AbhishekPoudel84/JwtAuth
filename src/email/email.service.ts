import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: configService.get('EMAIL_HOST_NAME'),
      port: configService.get('EMAIL_PORT_NUMBER'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
// import { createTransport, SendMailOptions } from 'nodemailer';
// import { SMTP_INFO } from '../config';
// import { Printer } from './printer';

// const transporter = createTransport({
//   host: SMTP_INFO.host,
//   port: 465,
//   secure: true,
//   auth: {
//     user: SMTP_INFO.user" target="_blank">SMTP_INFO.user,
//     pass: SMTP_INFO.password,
//   },
// });

// const sendMail = async (options: SendMailOptions) => {
//   try {
//     options.from = `${SMTP_INFO.user}`;
//     const result = await transporter.sendMail(options);
//     Printer('SEND MAIL RESULT START', result);
//   } catch (err) {
//     Printer('SEND MAIL ERROR START', err);
//   }
// };

// export { sendMail };
