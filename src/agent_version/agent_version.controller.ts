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
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('agent-versions')
@ApiExtraModels(
  CreateAgentVersionSuc,
  CreateAgentVersionFail,
  GetLTSAgentVersionInfoSuc,
  GetLTSAgentVersionInfoFail,
  GetLTSAgentFail,
)
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
  @ApiCreatedResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateAgentVersionSuc) },
        { $ref: getSchemaPath(CreateAgentVersionFail) },
      ],
    },
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
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GetLTSAgentVersionInfoSuc) },
        { $ref: getSchemaPath(GetLTSAgentVersionInfoFail) },
      ],
    },
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
