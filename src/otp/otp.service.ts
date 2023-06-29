import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { totp } from "otplib";

@Injectable()
export class OtpService {
  private otpService;
  private secret;

  constructor(private readonly configService: ConfigService) {
    totp.options = {
      step: 600, //10 min
    };
    this.otpService = totp;
    this.secret = this.configService.get("SECRET");
  }

  getToken() {
    return this.otpService.generate(this.secret);
  }

  confirmOtp(token: string) {
    return this.otpService.check(token, this.secret);
  }
}
