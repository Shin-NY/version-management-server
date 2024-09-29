import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, readdirSync } from 'fs';
import { join } from 'path';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { Repository } from 'typeorm';
import {
  GetModuleFileFail,
  GetModuleFileSuc,
} from './dtos/get-module-file.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleInfo)
    private readonly moduleInfosRepo: Repository<ModuleInfo>,
  ) {}
  async getModuleInfos(): Promise<ModuleInfo[]> {
    return await this.moduleInfosRepo.find({ order: { createdAt: 'DESC' } });
  }

  async uploadModuleInfo(name: string, version: string, hash: string) {
    const newModuleInfo = this.moduleInfosRepo.create({ name, version, hash });
    await this.moduleInfosRepo.save(newModuleInfo);
  }

  async getModuleFile(
    moduleId: number,
  ): Promise<GetModuleFileSuc | GetModuleFileFail> {
    const moduleInfo = await this.moduleInfosRepo.findOneBy({ id: moduleId });
    if (!moduleInfo) return { ok: false };

    const [filename] = readdirSync(
      join(
        process.cwd(),
        'uploaded_modules',
        `${moduleInfo.name}-${moduleInfo.version}`,
      ),
    );

    const file = createReadStream(
      join(
        process.cwd(),
        'uploaded_modules',
        `${moduleInfo.name}-${moduleInfo.version}`,
        filename,
      ),
    );

    return { ok: true, filename, file };
  }
}
