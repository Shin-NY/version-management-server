import { Controller, Post, Get, Delete, Param, Res, Body } from '@nestjs/common';
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
      console.log('Messages:', messages);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
  
  @Delete('delete_message/:id')
  async deleteMessage(@Param('id') id: string, @Res() res: Response) {
    console.log('Received DELETE request for ID:', id);
    try {
      const deleted = await this.messagesService.deleteMessage(id);
      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Message deleted successfully!',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Message not found',
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  @Post('send_message')
  async sendMessage(
    @Body('message') message: string,
    @Res() res: Response,
  ) {
    try {
      const savedMessage = await this.messagesService.addMessageToQueue(message);
      res.status(200).json({
        success: true,
        message: 'Message queued successfully!',
        data: savedMessage,
      });
    } catch (error) {
      console.error('Error queuing message:', error);
      res.status(500).json({ error: 'Failed to queue message' });
    }
  }

  @Get('fetch_queued_messages')
  async fetchQueuedMessages(@Res() res: Response) {
    try {
      const messages = await this.messagesService.fetchQueuedMessages();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching queued messages:', error);
      res.status(500).json({ error: 'Failed to fetch queued messages' });
    }
  }

}
