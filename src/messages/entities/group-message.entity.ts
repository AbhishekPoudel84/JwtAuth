import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groupmessage')
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: number;

  @Column()
  message: string;

  @Column()
  createdAt: Date;
}
