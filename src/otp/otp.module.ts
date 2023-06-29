import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
