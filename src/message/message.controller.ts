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
      console.log('Saving message to SQLite:', newMessage);  // 저장되는 메시지 형식 출력
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
  
  @Get('fetch_new_messages/:agentId')
  async fetchNewMessages(@Param('agentId') agentId: string, @Res() res: Response) {
    try {
      console.log(`Received request for new messages from agent: ${agentId}`);  // 요청 확인을 위한 콘솔 출력
      
      // 현재 에이전트가 읽은 마지막 메시지 ID 가져오기
      const lastReadMessageId = await this.messagesService.fetchLastReadMessageId(agentId);
      
      // 새로운 메시지 ID 목록에서 읽은 메시지 제외하고 가져오기
      const unreadMessageIds = await this.messagesService.fetchUnreadMessageIds(lastReadMessageId);
      
      // 읽지 않은 메시지들 가져오기
      const messages = await this.messagesService.fetchMessagesByIds(unreadMessageIds);
      
      if (messages.length > 0) {    
        const latestMessageId = unreadMessageIds[unreadMessageIds.length - 1];
        await this.messagesService.markMessagesAsRead(agentId, latestMessageId);
        console.log(`Marked messages as read for agent: ${agentId}, up to message ID: ${latestMessageId}`); // 마킹 정보 출력
      }

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching new messages:', error);
      res.status(500).json({ error: 'Failed to fetch new messages' });
    }
  }
}
