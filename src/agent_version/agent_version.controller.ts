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
  CreateAgentVersionFormData,
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
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { ApiResponseOneOf } from 'src/swagger/api-response-oneof.decorator';

@Controller('agent-versions')
export class AgentVersionController {
  constructor(private readonly agentVersionService: AgentVersionService) {}

  /**
   * 에이전트의 새로운 버전을 생성합니다
   */
  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAgentVersionFormData })
  @ApiResponseOneOf([CreateAgentVersionSuc, CreateAgentVersionFail], {
    status: 201,
  })
  async createAgentVersion(
    @Body() body: CreateAgentVersionInput,
    @UploadedFiles()
    files: InstanceType<typeof CreateAgentVersionFormData>['files'],
  ): Promise<CreateAgentVersionSuc | CreateAgentVersionFail> {
    return this.agentVersionService.createAgentVersion(body, files);
  }

  /**
   * 에이전트의 최신 버전 정보를 가져옵니다
   */
  @Get('/lts')
  @ApiResponseOneOf([GetLTSAgentVersionInfoSuc, GetLTSAgentVersionInfoFail], {
    status: 200,
  })
  async getLTSAgentVersionInfo(): Promise<
    GetLTSAgentVersionInfoSuc | GetLTSAgentVersionInfoFail
  > {
    return this.agentVersionService.getLTSAgentVersionInfo();
  }

  /**
   * 에이전트의 최신 버전 파일을 받습니다.
   */
  @Get('/lts/download')
  @ApiOkResponse({ type: GetLTSAgentFail })
  getLTSAgent(): GetLTSAgentSuc | GetLTSAgentFail {
    return this.agentVersionService.getLTSAgent();
  }
}
