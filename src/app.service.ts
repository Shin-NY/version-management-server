import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ModuleInfo } from './entities/module-info.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(ModuleInfo)
    private readonly moduleInfosRepo: Repository<ModuleInfo>,
  ) {}

  async getMessages(): Promise<Message[]> {
    return await this.messagesRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getModules(): Promise<ModuleInfo[]> {
    return await this.moduleInfosRepo.find({ order: { createdAt: 'DESC' } });
  }

  async uploadMessage(title: string, message: string) {
    const newMessage = this.messagesRepo.create({ title, message });
    await this.messagesRepo.save(newMessage);
  }

  async uploadModuleInfo(name: string, version: string, hash: string) {
    const newModuleInfo = this.moduleInfosRepo.create({ name, version, hash });
    await this.moduleInfosRepo.save(newModuleInfo);
  }
}
