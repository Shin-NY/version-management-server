import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message_info.entity';
import { CreateMessageInput } from './dtos/create_message.dto';
import { MessageSend } from './entities/message_send.entity';
import { MessageReadStatus } from './entities/message_read_status.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(MessageSend)
    private readonly messageSendRepo: Repository<MessageSend>,
    @InjectRepository(MessageReadStatus)
    private readonly messageReadStatusRepo: Repository<MessageReadStatus>,
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

  // 메시지 ID 저장
  async saveMessageToSend(messageId: string): Promise<boolean> {
    const newMessageSend = this.messageSendRepo.create({ messageId });
    const result = await this.messageSendRepo.save(newMessageSend);
    return !!result;
  }

  // 새로운 메시지 ID 목록 조회
  async fetchNewMessageIds(agentId: string): Promise<string[]> {
    // 현재 에이전트가 마지막으로 읽은 메시지를 찾습니다.
    const readStatus = await this.messageReadStatusRepo.findOne({ where: { agentId } });

    let unreadMessages: MessageSend[];
    if (readStatus) {
      // 마지막으로 읽은 메시지 ID 이후의 메시지를 모두 가져옵니다.
      unreadMessages = await this.messageSendRepo.createQueryBuilder('messageSend')
        .where('messageSend.id > :lastReadId', { lastReadId: readStatus.messageId })
        .getMany();
    } else {
      // 처음 요청인 경우 모든 메시지를 가져옵니다.
      unreadMessages = await this.messageSendRepo.find();
    }

    // 새로운 메시지의 ID 목록을 반환합니다.
    return unreadMessages.map((ms) => ms.messageId);
  }

  // 에이전트가 메시지를 읽었음을 마킹
  async markMessagesAsRead(agentId: string, lastReadMessageId: string): Promise<void> {
    let readStatus = await this.messageReadStatusRepo.findOne({ where: { agentId } });

    if (readStatus) {
      // 기존 레코드가 있으면 업데이트합니다.
      readStatus.messageId = lastReadMessageId;
      await this.messageReadStatusRepo.save(readStatus);
    } else {
      // 새로운 레코드를 생성합니다.
      readStatus = this.messageReadStatusRepo.create({ agentId, messageId: lastReadMessageId });
      await this.messageReadStatusRepo.save(readStatus);
    }
  }

  // ID에 해당하는 메시지 조회
  async fetchMessagesByIds(ids: string[]): Promise<Message[]> {
    return this.messagesRepo.findByIds(ids); // ID 배열로 메시지 조회
  }

  // 현재 에이전트가 읽은 마지막 메시지 ID 가져오기
  async fetchLastReadMessageId(agentId: string): Promise<string | null> {
    const readStatus = await this.messageReadStatusRepo.findOne({ where: { agentId } });
    return readStatus ? readStatus.messageId : null;
  }

  // 읽지 않은 메시지 ID 목록 조회
  async fetchUnreadMessageIds(lastReadMessageId: string | null): Promise<string[]> {
    let unreadMessages: MessageSend[];
    if (lastReadMessageId) {
      unreadMessages = await this.messageSendRepo.createQueryBuilder('messageSend')
        .where('messageSend.id > :lastReadId', { lastReadId: lastReadMessageId })
        .getMany();
    } else {
      unreadMessages = await this.messageSendRepo.find();
    }
    return unreadMessages.map((ms) => ms.messageId);
  }
}
