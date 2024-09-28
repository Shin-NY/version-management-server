import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/')
  async getMessages(): Promise<Message[]> {
    return this.messageService.getMessages();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async uploadMessage(@Req() req: Request): Promise<void> {
    const { title, message } = req.body as unknown as Pick<
      Message,
      'title' | 'message'
    >;
    await this.messageService.uploadMessage(title, message);
  }
}
