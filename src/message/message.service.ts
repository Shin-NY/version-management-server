import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message_info.entity';
import { CreateMessageInput } from './dtos/create_message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
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
}
