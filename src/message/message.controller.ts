import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dtos/create-message.dto';

@Controller('message')
export class MessagesController {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
  ) {}

  @Post('save_message')
  async saveMessage(
    @Body() createMessageInput: CreateMessageInput,
    @Res() res: Response,
  ) {
    try {
      const { userId, message, date } = createMessageInput;
      if ( !userId || !message || !date  ) {
        return res.status(400).json({ error: 'Message, date, and userId are required' });
      }

      const newMessage = this.messagesRepo.create({ userId, message, date });
      await this.messagesRepo.save(newMessage);
      res.status(200).json({ success: true, message: 'Message saved successfully!' });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  }

  @Get('fetch_messages')
  async fetchMessages(@Res() res: Response) {
    try {
      const messages = await this.messagesRepo.find();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
  ) {}

  async saveMessage(createMessageInput: CreateMessageInput): Promise<Message> {
    const newMessage = this.messagesRepo.create(createMessageInput);
    return await this.messagesRepo.save(newMessage);
  }

  async fetchMessages(): Promise<Message[]> {
    return await this.messagesRepo.find();
  }
}
