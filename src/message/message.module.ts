import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './message.controller';
import { MessagesService } from './message.service';
import { Message } from './entities/message_info.entity';
import { MessageSend } from './entities/message_send.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageSend])], 
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
