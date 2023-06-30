import { Module, forwardRef } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesGateway } from "./messages.gateway";
import { AppModule } from "src/app.module";
import { JWTModule } from "src/jwt/jwt-module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupMessage } from "./entities/group-message.entity";
import { PrivateMessage } from "./entities/private-message.entity";
import { MessageMention } from "./entities/message-mention.entity";
import { FileModule } from "src/file/file.module";

@Module({
  imports: [
    AppModule,
    JWTModule,
    TypeOrmModule.forFeature([GroupMessage, PrivateMessage, MessageMention]),
    // forwardRef(() => FileModule),
    // FileModule,
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
