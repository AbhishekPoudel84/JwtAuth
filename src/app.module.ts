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
import { JWTModule } from './jwt/jwt-module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'authtry',
      entities: [User],
      synchronize: true,
      migrationsTableName: 'migrations',
      migrations: [],
    }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
    OtpModule,
    ConfigModule,
    JWTModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
