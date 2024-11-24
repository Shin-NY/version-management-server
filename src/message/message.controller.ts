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
  async sendMessage(@Body('messageId') messageId: string, @Res() res: Response) {
    try {
      const saved = await this.messagesService.saveMessageToSend(messageId); // 메시지 전송용 ID 저장
      if (saved) {
        res.status(200).json({
          success: true,
          message: 'Message ID saved for sending to clients!',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to save message ID!',
        });
      }
    } catch (error) {
      console.error('Error saving message ID for clients:', error);
      res.status(500).json({ error: 'Failed to save message ID' });
    }
  }
  
  @Get('fetch_new_messages')
  async fetchNewMessages(@Res() res: Response) {
    try {
      const newMessageIds = await this.messagesService.fetchNewMessageIds(); // 새로운 메시지 ID 목록
      const messages = await this.messagesService.fetchMessagesByIds(newMessageIds); // ID에 해당하는 메시지 가져오기
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching new messages:', error);
      res.status(500).json({ error: 'Failed to fetch new messages' });
    }
  }

}
