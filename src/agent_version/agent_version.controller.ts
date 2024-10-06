import {
  Body,
  Controller,
  Get,
  Post,
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
  getLTSAgent(): GetLTSAgentSuc | GetLTSAgentFail {
    return this.agentVersionService.getLTSAgent();
  }
}
