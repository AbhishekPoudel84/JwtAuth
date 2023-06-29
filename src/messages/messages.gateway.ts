/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from "@nestjs/websockets";

import { MessagesService } from "./messages.service";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { JWTService } from "src/jwt/jwt-service";
import { PrivateMessageDto } from "./dto/private-message.dto";
import { GroupMessageDto } from "./dto/group-message.dto";
import { GroupMessage } from "./entities/group-message.entity";

@WebSocketGateway({
  cors: {
    origin: "*",
    withCredentials: true, //to send credentials such as cookies, authorization headers
  },
})
export class MessagesGateway implements OnGatewayConnection {
  constructor(
    private readonly messagesService: MessagesService,
    private appService: AppService,
    private jwtService: JWTService
  ) {}

  @WebSocketServer()
  public server: Server;

  async handleConnection(socket: Socket) {
    //authenticated user
    try {
      const jwtToken = socket.handshake.headers.token;
      const data = await this.jwtService.verifyAsync(jwtToken.toString());
      if (!data) {
        return socket.disconnect();
      }
      const user = await this.appService.findOne({ id: data["id"] });
      const { password, ...result } = user;
      // set userId on socket
      socket.data = { ...result };
      // notify new user to group
      socket.broadcast.emit("new-user", { ...result });
      // join user to room
      socket.join(data.id.toString());
    } catch (e) {
      return socket.disconnect();
    }
  }

  //private msg
  @SubscribeMessage("private-message")
  async privateMessage(
    @MessageBody() privateMessageDto: PrivateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const fromUser = { id: client.data.id };
    const toUser = { id: privateMessageDto.to };
    const newData = { ...privateMessageDto, fromUser, toUser };
    client.join(newData.to.toString());
    client.to(newData.to.toString()).emit("private-message", { ...newData });
    await this.messagesService.privateMessage({ ...newData });
  }

  //group Message
  @SubscribeMessage("group-message")
  async groupMesage(
    @MessageBody() groupMessageDto: GroupMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const fromUser = client.data;
    const mentionedUserIds = groupMessageDto.mentionedIds;
    const repliedMessageId = groupMessageDto.repliedMessageId;
    const newData = {
      ...groupMessageDto,
      fromUser: fromUser,
      repliedMessageId,
    };
    const value = await this.messagesService.groupMessage({ ...newData });
    client.broadcast.emit("group-message", { ...newData });
    if (repliedMessageId) {
      const repliedMessage = await this.messagesService.findGroupMessage({
        id: repliedMessageId,
      });
      client
        .to(repliedMessage.fromUser.id.toString())
        .emit("replied-message", { ...value });
    }
    if (mentionedUserIds) {
      for (let i = 0; i < mentionedUserIds.length; i++) {
        const toUserId = mentionedUserIds[i];
        const toInsert = { toUserId, message: value };
        await this.messagesService.messageMention({ ...toInsert });
        client.to(toUserId.toString()).emit("message-mention", { ...newData });
      }
    }
  }

  //Mention
  // @SubscribeMessage("mention")
  // async mention(
  //   @MessageBody() groupMessageDto: GroupMessageDto,
  //   @ConnectedSocket() client: Socket
  // ) {
  //   const from = client.data.id;
  //   const newData = { ...groupMessageDto, from: from };
  //   client.broadcast.emit("group-message", { ...newData });
  // }

  // @SubscribeMessage("reply")
  // onMention(
  //   @MessageBody() groupMessageDto: GroupMessageDto,
  //   @ConnectedSocket() client: Socket
  // ) {
  //   if(body.message){
  //     this.server.to(body.to).emit("reply-chat",{
  //       from : client.data.id,
  //       message : `User ${client.data.id} replied `,
  //     });
  //   }
  // }

  //@SubscribeMessage('')
  // @SubscribeMessage('findAllMessages')
  // findAll() {
  //   return this.messagesService.findAll();
  // }

  // @SubscribeMessage('join')
  // joinRoom(
  //   @MessageBody('name') name: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   return this.messagesService.identify(name, client.id);
  // }

  // @SubscribeMessage('typing')
  // async typing(
  //   @MessageBody('isTyping') isTyping: boolean,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const name = await this.messagesService.getClientname(client.id);

  //   client.broadcast.emit('typing', { name, isTyping });
  // }
}
