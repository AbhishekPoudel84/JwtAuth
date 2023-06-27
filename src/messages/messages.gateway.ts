import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { JWTService } from 'src/jwt/jwt-service';
import { PrivateMessageDto } from './dto/private-message.dto';
import { GroupMessageDto } from './dto/group-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    withCredentials: true, //to send credentials such as cookies, authorization headers
  },
})
export class MessagesGateway implements OnGatewayConnection {
  constructor(
    private readonly messagesService: MessagesService,
    private appService: AppService,
    private jwtService: JWTService,
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
      const user = await this.appService.findOne({ id: data['id'] });
      const { password, ...result } = user;
      // set userId on socket
      socket.data = { ...result };

      socket.onAny((event, ...args) => {
        console.log(
          '🚀 ~ file: messages.gateway.ts:47 ~ MessagesGateway ~ socket.onAny ~ event:',
          event,
        );
        console.log(
          '🚀 ~ file: messages.gateway.ts:50 ~ MessagesGateway ~ socket.onAny ~ args:',
          args,
        );
      });
      // notify new user to group
      socket.broadcast.emit('new-user', { ...result });
      // join user to room
      socket.join(data.id.toString());
    } catch (e) {
      return socket.disconnect();
    }
  }

  //private msg
  @SubscribeMessage('private-message')
  async privateMessage(
    @MessageBody() privateMessageDto: PrivateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const from = client.data.id;
    const newData = { ...privateMessageDto, from };
    client.join(newData.to.toString());
    client.to(newData.to.toString()).emit('private-message', { ...newData });
  }

  @SubscribeMessage('group-message')
  async groupMesage(
    @MessageBody() groupMessageDto: GroupMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const newData = { ...groupMessageDto };
    client.broadcast.emit('group-message', { ...newData });
  }

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
