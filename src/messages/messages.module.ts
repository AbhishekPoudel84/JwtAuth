import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesGateway } from "./messages.gateway";
import { AppModule } from "src/app.module";
import { JWTModule } from "src/jwt/jwt-module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupMessage } from "./entities/group-message.entity";
import { PrivateMessage } from "./entities/private-message.entity";
import { MessageMention } from "./entities/message-mention.entity";

@Module({
  imports: [
    AppModule,
    JWTModule,
    TypeOrmModule.forFeature([GroupMessage, PrivateMessage, MessageMention]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
