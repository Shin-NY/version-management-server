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
import { join } from 'path';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
  unlinkSync,
} from 'fs';
import {
  ARCHIVED_AGENT_DIR_NAME,
  UPLOADED_AGENT_DIR_NAME,
} from './agent_version.constants';
import * as archiver from 'archiver';
import {
  GetLTSAgentFail,
  GetLTSAgentInput,
  GetLTSAgentSuc,
} from './dtos/get-lts-agent.dto';
import { v4 as uuidv4 } from 'uuid';
import { AgentFileInfo } from './entities/agent_file_info.entity';
import { createHash } from 'node:crypto';

@Injectable()
export class AgentVersionService {
  constructor(
    @InjectRepository(AgentVersion)
    private readonly agentVersionsRepo: Repository<AgentVersion>,
    @InjectRepository(AgentFileInfo)
    private readonly agentFileInfosRepo: Repository<AgentFileInfo>,
  ) {}

  async calcHashFromFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const rs = createReadStream(filePath);
      rs.on('error', reject);
      rs.on('data', (chunk) => hash.update(chunk));
      rs.on('end', () => resolve(hash.digest('hex')));
    });
  }

  async createAgentVersion(
    { version }: CreateAgentVersionInput,
    files: Array<Express.Multer.File>,
  ): Promise<CreateAgentVersionSuc | CreateAgentVersionFail> {
    try {
      // 이전 Version의 디렉토리 삭제 및 생성
      if (existsSync(UPLOADED_AGENT_DIR_NAME)) {
        rmSync(UPLOADED_AGENT_DIR_NAME, { recursive: true, force: true });
      }
      mkdirSync(UPLOADED_AGENT_DIR_NAME);

      // 각 파일을 개별적으로 저장
      for (const file of files) {
        const filePath = join(UPLOADED_AGENT_DIR_NAME, file.originalname);
        const writeStream = createWriteStream(filePath);
        writeStream.write(file.buffer);
        writeStream.end();
      }

      const newAgentVersion = await this.agentVersionsRepo.save(
        this.agentVersionsRepo.create({
          version,
        }),
      );
      /**
       * 파일 목록을 미리 db에 저장합니다
       */
      files.forEach(
        async (file) =>
          await this.agentFileInfosRepo.save(
            this.agentFileInfosRepo.create({
              filename: file.originalname,
              hash: await this.calcHashFromFile(
                join(UPLOADED_AGENT_DIR_NAME, file.originalname),
              ),
              version: { id: newAgentVersion.id },
            }),
          ),
      );

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
      /**
       * db에 저장해놓은 파일 목록까지 같이 가져옵니다
       */
      const [agentVersion] = await this.agentVersionsRepo.find({
        order: { createdAt: 'DESC' },
        take: 1,
        relations: { fileInfos: true },
      });
      if (!agentVersion)
        return { ok: false, error: 'no agent version is available' };

      return { ok: true, result: agentVersion };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent version' };
    }
  }

  async archiveAgentFiles(filenames: string[], path: string) {
    if (!existsSync(UPLOADED_AGENT_DIR_NAME))
      return { ok: false, error: 'agent not exists' };

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // 입력받은 파일들 for문으로 하나씩 아카이브에 추가하는 로직
    filenames.forEach((filename) => {
      const filePath = join(UPLOADED_AGENT_DIR_NAME, filename);
      if (!existsSync(filePath))
        return { ok: false, error: `${filename} not exists` };

      // 파일이 존재하면 아카이브에 추가
      archive.file(filePath, { name: filename });
    });

    if (!existsSync(ARCHIVED_AGENT_DIR_NAME))
      mkdirSync(ARCHIVED_AGENT_DIR_NAME);

    const archiveDest = createWriteStream(path);
    archive.pipe(archiveDest);

    await archive.finalize();

    return { ok: true };
  }

  async getLTSAgent({
    filenames,
  }: GetLTSAgentInput): Promise<GetLTSAgentSuc | GetLTSAgentFail> {
    try {
      if (!filenames.length)
        return { ok: false, error: 'filenames should not be null' };

      const archivedFilename = `${uuidv4()}.zip`;
      const archivedPath = join(ARCHIVED_AGENT_DIR_NAME, archivedFilename);
      const { error } = await this.archiveAgentFiles(filenames, archivedPath);
      if (error) return { ok: false, error };

      // 파일 스트림 생성
      const archivedAgentFile = createReadStream(archivedPath);
      // 다운로드가 완료된 후 파일 삭제
      archivedAgentFile.on('end', () => unlinkSync(archivedPath));
      return new StreamableFile(archivedAgentFile, {
        disposition: `attachment; filename="agent.zip"`,
      });
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent' };
    }
  }
}
