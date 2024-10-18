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
  readdirSync
} from 'fs';
import { unlink } from 'fs/promises';
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
      if (!agentVersion) return { ok: false, error: 'no agent version is available' };

      /**
       * 여러 파일 중 어떠한 파일을 입력 받을지 선택해야하기 때문에 파일 목록을 가져오는 로직 추가했습니다.
       */ 
      const files = readdirSync(UPLOADED_AGENT_DIR_NAME); 
      return { ok: true, result: { version: agentVersion.version, createdAt: agentVersion.createdAt, files } };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent version' };
    }
  }

  async getLTSAgent(selectedFiles: string[]): Promise<StreamableFile | GetLTSAgentFail> {
    const zipFilePath = join(UPLOADED_AGENT_DIR_NAME, UPLOADED_AGENT_ZIP_FILE_NAME);
    try {
      if (!existsSync(UPLOADED_AGENT_DIR_NAME)) {
        return { ok: false, error: 'no agent available' };
      }
  
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
  
      const archiveDest = createWriteStream(zipFilePath);
      archive.pipe(archiveDest);
  
      // 입력받은 파일들 for문으로 하나씩 아카이브에 추가하는 로직
      for (const fileName of selectedFiles) {
        const trimmedFileName = fileName.trim();
        const filePath = join(UPLOADED_AGENT_DIR_NAME, trimmedFileName);
  
        if (existsSync(filePath)) {
          // 파일이 존재하면 아카이브에 추가
          archive.file(filePath, { name: trimmedFileName });
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }
  
      await archive.finalize();
  
      // 파일 스트림 생성
      const fileStream = createReadStream(zipFilePath);
  
      // 다운로드가 완료된 후 파일 삭제
      return new Promise((resolve, reject) => {
        fileStream.on('end', async () => {
          try {
            await unlink(zipFilePath); // 파일 삭제
            console.log(`ZIP file ${zipFilePath} has been removed successfully.`);
          } catch (err) {
            console.error(`Error removing ZIP file: ${zipFilePath}`, err);
          }
        });
  
        fileStream.on('error', (err) => {
          console.error(`Error reading ZIP file: ${zipFilePath}`, err);
          reject({ ok: false, error: 'cannot get lts agent' });
        });
  
        resolve(new StreamableFile(fileStream, {
          disposition: `attachment; filename="${UPLOADED_AGENT_ZIP_FILE_NAME}"`,
        }));
      });
  
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'cannot get lts agent' };
    }
  }
}  