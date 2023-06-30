export class File {}
import { GroupMessage } from "src/messages/entities/group-message.entity";
import { User } from "src/user/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("file_upload")
export class FileUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (fromUser: User) => fromUser.privateMessages)
  fromUser: User;

  @Column()
  fileName: string;

  @ManyToOne(() => GroupMessage, (message: GroupMessage) => message.fileUploads)
  message: GroupMessage;

  @CreateDateColumn()
  createdAt: Date;
}
