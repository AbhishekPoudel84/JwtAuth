import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessage } from "./entities/group-message.entity";
import { PrivateMessage } from "./entities/private-message.entity";
import { MessageMention } from "./entities/message-mention.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(MessageMention)
    private readonly messageMentionRepository: Repository<MessageMention>,
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepository: Repository<PrivateMessage>
  ) {}

  async groupMessage(groupMessage) {
    return this.groupMessageRepository.save(groupMessage);
  }
  async messageMention(messageMention) {
    return this.messageMentionRepository.save(messageMention);
  }

  async findGroupMessage(condition: any) {
    return this.groupMessageRepository.findOne({
      where: {
        ...condition,
      },
    });
  }

  async privateMessage(privateMessage) {
    return this.privateMessageRepository.save(privateMessage);
  }
  // messages: Message[] = [{ name: 'Marius', text: 'hi' }];
  // clientToUser = {};
  // identify(name: string, clientId: string) {
  //   this.clientToUser[clientId] = name;
  //   return Object.values(this.clientToUser);
  // }
  // getClientname(clientId: string) {
  //   return this.clientToUser[clientId];
  // }
  // create(createMessageDto: CreateMessageDto, clientId: string) {
  //   const message = {
  //     name: this.clientToUser[clientId],
  //     text: createMessageDto.text,
  //   };
  //   this.messages.push(message);
  //   return message;
  // }
  // findAll() {
  //   return this.messages;
  // }
  //
  //  async privateMessage(privateMessageDto: PrivateMessageDto) {
  //  const privateMessage = new PrivateMessage();
  //  privateMessage.from = privateMessageDto.from;
  //  privateMessage.to = privateMessageDto.to;
  //  privateMessage.message = privateMessageDto.message;
  //  console.log(
  //  "🚀 ~ file: messages.service.ts:48 ~ MessagesService ~ privateMessage ~ privateMessage:",
  //  privateMessage
  //  );
  // return this.messageRepository.save({privateMessage});
  // }
}
