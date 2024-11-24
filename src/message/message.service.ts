import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message_info.entity';
import { CreateMessageInput } from './dtos/create_message.dto';
import { MessageSend } from './entities/message_send.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(MessageSend)
    private readonly messageSendRepo: Repository<MessageSend>,
  ) {}

  // 메시지 저장
  async saveMessage(createMessageInput: CreateMessageInput): Promise<Message> {
    const newMessage = this.messagesRepo.create(createMessageInput);
    return await this.messagesRepo.save(newMessage);
  }

  // 메시지 조회
  async fetchMessages(): Promise<Message[]> {
    return await this.messagesRepo.find();
  }

  // 메시지 삭제
  async deleteMessage(id: string): Promise<boolean> {
    const result = await this.messagesRepo.delete(id); 
    
    if (!result) {
      return false; 
    }
    
    if (result.affected == null) {
      return false;
    }

    return result.affected > 0;
    }

  // 메시지 ID 저장
  async saveMessageToSend(messageId: string): Promise<boolean> {
    const newMessageSend = this.messageSendRepo.create({ messageId });
    const result = await this.messageSendRepo.save(newMessageSend);
    return !!result;
  }

  // 새로운 메시지 ID 목록 조회
  async fetchNewMessageIds(): Promise<string[]> {
    const messageSends: MessageSend[] = await this.messageSendRepo.find();
  return messageSends.map((ms) => ms.messageId); 
  }

  // ID에 해당하는 메시지 조회
  async fetchMessagesByIds(ids: string[]): Promise<Message[]> {
    return this.messagesRepo.findByIds(ids); // ID 배열로 메시지 조회
  }
}
