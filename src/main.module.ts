import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { MessagesModule } from './messages/messages.module';
import { AppModule } from './app.module';

@Module({
  imports: [MessagesModule, AppModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
