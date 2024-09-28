import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleInfo)
    private readonly moduleInfosRepo: Repository<ModuleInfo>,
  ) {}
  async getModules(): Promise<ModuleInfo[]> {
    return await this.moduleInfosRepo.find({ order: { createdAt: 'DESC' } });
  }

  async uploadModuleInfo(name: string, version: string, hash: string) {
    const newModuleInfo = this.moduleInfosRepo.create({ name, version, hash });
    await this.moduleInfosRepo.save(newModuleInfo);
  }
}
