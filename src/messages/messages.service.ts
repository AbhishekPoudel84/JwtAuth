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
      relations: ["fromUser"],
    });
  }

  async privateMessage(privateMessage) {
    return this.privateMessageRepository.save(privateMessage);
  }
}
