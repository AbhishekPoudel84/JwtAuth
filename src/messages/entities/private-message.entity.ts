import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('privatemessage')
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column()
  message: string;

  @Column()
  createdAt: Date;
}
