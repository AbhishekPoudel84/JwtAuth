import { FileUpload } from "src/file/entities/file.entity";
import { GroupMessage } from "src/messages/entities/group-message.entity";
import { PrivateMessage } from "src/messages/entities/private-message.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(
    () => GroupMessage,
    (groupMessage: GroupMessage) => groupMessage.fromUser
  )
  public groupMessages: GroupMessage[];

  @OneToMany(
    () => PrivateMessage,
    (privateMessage: PrivateMessage) => privateMessage.fromUser
  )
  public privateMessages: PrivateMessage[];

  @OneToMany(
    () => PrivateMessage,
    (receivedPrivateMessage: PrivateMessage) => receivedPrivateMessage.toUser
  )
  public receivedPrivateMessages: PrivateMessage[];

  @OneToMany(
    () => FileUpload,
    (uploadedFile: FileUpload) => uploadedFile.fromUser
  )
  public uploadedFiles: FileUpload[];
}
