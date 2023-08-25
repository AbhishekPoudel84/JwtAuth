import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: configService.get("EMAIL_HOST_NAME"),
      port: configService.get("EMAIL_PORT_NUMBER"),
      auth: {
        user: configService.get("EMAIL_USER"),
        pass: configService.get("EMAIL_PASSWORD"),
      },
    });
  }
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
