import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './message.controller';
import { MessagesService } from './message.service';
import { Message } from './entities/message_info.entity';
import { MessageSend } from './entities/message_send.entity';
import { MessageReadStatus } from './entities/message_read_status.entity'; // 새로 추가된 엔티티 임포트

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageSend, MessageReadStatus])], // MessageReadStatus 추가
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
