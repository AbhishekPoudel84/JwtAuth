/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/user.entity";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./email/email.module";
import { OtpModule } from "./otp/otp.module";
import { JWTModule } from "./jwt/jwt-module";
import { GroupMessage } from "./messages/entities/group-message.entity";
import { PrivateMessage } from "./messages/entities/private-message.entity";
import { MessageMention } from "./messages/entities/message-mention.entity";
import { FileModule } from "./file/file.module";
import { FileUpload } from "./file/entities/file.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "authtry",
      entities: [
        User,
        GroupMessage,
        PrivateMessage,
        MessageMention,
        FileUpload,
      ],
      synchronize: true,
      migrationsTableName: "migrations",
      migrations: [],
    }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
    OtpModule,
    ConfigModule,
    JWTModule,
    ConfigModule.forRoot(),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
