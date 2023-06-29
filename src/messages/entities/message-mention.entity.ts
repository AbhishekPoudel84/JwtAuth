import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupMessage } from "./group-message.entity";

@Entity("message_mention")
export class MessageMention {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => GroupMessage,
    (message: GroupMessage) => message.messageMentions
  )
  message: GroupMessage;

  // @ManyToOne(()=>User, )
  toUserId: number;

  @CreateDateColumn()
  createdAt: Date;
}
