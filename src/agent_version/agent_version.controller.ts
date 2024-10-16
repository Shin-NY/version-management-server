import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateAgentVersionFail,
  CreateAgentVersionInput,
  CreateAgentVersionSuc,
} from './dtos/create-agent-version.dto';
import { AgentVersionService } from './agent_version.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  GetLTSAgentVersionInfoFail,
  GetLTSAgentVersionInfoSuc,
} from './dtos/get-lts-agent-version-info.dto';
import { GetLTSAgentFail, GetLTSAgentSuc } from './dtos/get-lts-agent.dto';
import { StreamableFile } from '@nestjs/common';

@Controller('agent-versions')
export class AgentVersionController {
  constructor(private readonly agentVersionService: AgentVersionService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createAgentVersion(
    @Body() body: CreateAgentVersionInput,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CreateAgentVersionSuc | CreateAgentVersionFail> {
    return this.agentVersionService.createAgentVersion(body, files);
  }

  @Get('/lts')
  async getLTSAgentVersionInfo(): Promise<
    GetLTSAgentVersionInfoSuc | GetLTSAgentVersionInfoFail
  > {
    return this.agentVersionService.getLTSAgentVersionInfo();
  }

  @Get('/lts/download')
  async getLTSAgent(
    @Query('files') files: string, // 파일 이름을 단일 문자열로 수신
  ): Promise<StreamableFile | GetLTSAgentFail> {
    // 문자열을 쉼표로 분리하고 각 파일 이름에서 공백을 제거(원하는 파일만 묶어서 압축 후 반환하기 위함입니다.)
    const selectedFiles = files.split(',').map(name => name.trim()).filter(name => name);
    return this.agentVersionService.getLTSAgent(selectedFiles);
  }  
}
