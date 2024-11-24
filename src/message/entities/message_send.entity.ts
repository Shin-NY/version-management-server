import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageSend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
