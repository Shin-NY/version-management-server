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
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { ApiResponseOneOf } from 'src/swagger/api-response-oneof.decorator';
import { GetLTSAgentFail, GetLTSAgentSuc } from './dtos/get-lts-agent.dto';

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
   * 에이전트의 최신 버전 파일 중 일부분을 받습니다.
   */
  @Get('/lts/download')
  @ApiOkResponse({ type: GetLTSAgentFail })
  async getLTSAgent(
    @Query('filenames') filenames: string,
  ): Promise<GetLTSAgentSuc | GetLTSAgentFail> {
    // 문자열을 쉼표로 분리하고 각 파일 이름에서 공백을 제거(원하는 파일만 묶어서 압축 후 반환하기 위함입니다.)
    const trimmedFilenames = filenames
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name);
    return this.agentVersionService.getLTSAgent({
      filenames: trimmedFilenames,
    });
  }
}
