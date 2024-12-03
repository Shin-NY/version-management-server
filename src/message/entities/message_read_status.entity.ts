import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MessageReadStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  messageId: string; // 마지막으로 읽은 메시지 ID
}
