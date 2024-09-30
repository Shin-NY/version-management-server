import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, readdirSync } from 'fs';
import { join } from 'path';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { Repository } from 'typeorm';
import { CreateModuleVersionInput } from './dtos/create-module-version.dto';
import { ModuleVersion } from './entities/module-version.entity';
import { CreateModuleInfoInput } from './dtos/create-module-info.dto';
import {
  GetVersionsFail,
  GetVersionsInput,
  GetVersionsSuc,
} from './dtos/get-versions-dto';
import {
  GetModuleFileFail,
  GetModuleFileSuc,
} from './dtos/get-module-file.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleInfo)
    private readonly moduleInfosRepo: Repository<ModuleInfo>,
    @InjectRepository(ModuleVersion)
    private readonly moduleVersionsRepo: Repository<ModuleVersion>,
  ) {}

  async createModuleInfo(input: CreateModuleInfoInput) {
    await this.moduleInfosRepo.save(
      this.moduleInfosRepo.create({ name: input.name }),
    );
  }

  async getModuleInfos(): Promise<ModuleInfo[]> {
    return await this.moduleInfosRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getVersions({
    moduleId,
  }: GetVersionsInput): Promise<GetVersionsSuc | GetVersionsFail> {
    const moduleInfo = await this.moduleVersionsRepo.find({
      where: {
        module: { id: moduleId },
      },
      order: { createdAt: 'DESC' },
    });

    if (!moduleInfo) return { ok: false };

    return { ok: true, result: moduleInfo };
  }

  async createModuleVersion({
    moduleId,
    version,
    hash,
  }: CreateModuleVersionInput) {
    const newModuleVersion = this.moduleVersionsRepo.create({
      module: { id: moduleId },
      version,
      hash,
    });
    await this.moduleVersionsRepo.save(newModuleVersion);
  }

  async getModuleFile(
    versionId: number,
  ): Promise<GetModuleFileSuc | GetModuleFileFail> {
    const version = await this.moduleVersionsRepo.findOne({
      where: {
        id: versionId,
      },
      loadRelationIds: { relations: ['module'] },
    });

    if (!version) return { ok: false };

    const [filename] = readdirSync(
      join(
        process.cwd(),
        'uploaded_modules',
        `${version.moduleId}-${version.version}`,
      ),
    );

    const file = createReadStream(
      join(
        process.cwd(),
        'uploaded_modules',
        `${version.moduleId}-${version.version}`,
        filename,
      ),
    );

    return { ok: true, filename, file };
  }
}
