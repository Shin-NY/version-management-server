import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MessagesService } from './message.service';
import { CreateMessageInput } from './dtos/create_message.dto';

@Controller('message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('save_message')
  async saveMessage(
    @Body() createMessageInput: CreateMessageInput,
    @Res() res: Response,
  ) {
    try {
      const newMessage =
        await this.messagesService.saveMessage(createMessageInput);
      res.status(200).json({
        success: true,
        message: 'Message saved successfully!',
        data: newMessage,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  }

  @Get('fetch_messages')
  async fetchMessages(@Res() res: Response) {
    try {
      const messages = await this.messagesService.fetchMessages();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
}
