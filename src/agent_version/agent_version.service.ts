import { Injectable, StreamableFile } from '@nestjs/common';
import {
  CreateAgentVersionFail,
  CreateAgentVersionInput,
  CreateAgentVersionSuc,
} from './dtos/create-agent-version.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentVersion } from './entities/agent_version.entity';
import {
  GetLTSAgentVersionInfoFail,
  GetLTSAgentVersionInfoSuc,
} from './dtos/get-lts-agent-version-info.dto';
import { GetLTSAgentFail, GetLTSAgentSuc } from './dtos/get-lts-agent.dto';
import { join } from 'path';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
} from 'fs';
import {
  UPLOADED_AGENT_DIR_NAME,
  UPLOADED_AGENT_ZIP_FILE_NAME,
} from './agent_version.constants';
import * as archiver from 'archiver';

@Injectable()
export class AgentVersionService {
  constructor(
    @InjectRepository(AgentVersion)
    private readonly agentVersionsRepo: Repository<AgentVersion>,
  ) {}

  async createAgentVersion(
    { version }: CreateAgentVersionInput,
    files: Array<Express.Multer.File>,
  ): Promise<CreateAgentVersionSuc | CreateAgentVersionFail> {
    try {
      await this.agentVersionsRepo.save(
        this.agentVersionsRepo.create({
          version,
        }),
      );

      if (existsSync(UPLOADED_AGENT_DIR_NAME))
        rmSync(UPLOADED_AGENT_DIR_NAME, { recursive: true, force: true });
      mkdirSync(UPLOADED_AGENT_DIR_NAME);

      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      for (const file of files) {
        archive.append(file.buffer, { name: file.originalname });
      }

      const archiveDest = createWriteStream(
        join(UPLOADED_AGENT_DIR_NAME, UPLOADED_AGENT_ZIP_FILE_NAME),
      );
      archive.pipe(archiveDest);
      await archive.finalize();

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot create an agent version' };
    }
  }

  async getLTSAgentVersionInfo(): Promise<
    GetLTSAgentVersionInfoSuc | GetLTSAgentVersionInfoFail
  > {
    try {
      const [agentVersion] = await this.agentVersionsRepo.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
      if (!agentVersion)
        return { ok: false, error: 'no agent version is available' };

      return { ok: true, result: agentVersion };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent version' };
    }
  }

  getLTSAgent(): GetLTSAgentSuc | GetLTSAgentFail {
    try {
      if (
        !existsSync(join(UPLOADED_AGENT_DIR_NAME, UPLOADED_AGENT_ZIP_FILE_NAME))
      )
        return { ok: false, error: 'no agent available' };

      const file = createReadStream(
        join(UPLOADED_AGENT_DIR_NAME, UPLOADED_AGENT_ZIP_FILE_NAME),
      );

      return new StreamableFile(file, {
        disposition: `attachment; filename="${UPLOADED_AGENT_ZIP_FILE_NAME}"`,
      });
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent' };
    }
  }
}
