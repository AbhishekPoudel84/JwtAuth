import { User } from "src/user/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MessageMention } from "./message-mention.entity";

@Entity("group_message")
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (fromUser: User) => fromUser.groupMessages)
  fromUser: User;

  @Column()
  message: string;

  @OneToMany(
    () => MessageMention,
    (messageMention: MessageMention) => messageMention.message
  )
  messageMentions: MessageMention[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  repliedMessageId: number;
}
