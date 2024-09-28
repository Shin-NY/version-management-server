import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
  ) {}

  async getMessages(): Promise<Message[]> {
    return await this.messagesRepo.find({ order: { createdAt: 'DESC' } });
  }

  async uploadMessage(title: string, message: string) {
    const newMessage = this.messagesRepo.create({ title, message });
    await this.messagesRepo.save(newMessage);
  }
}
