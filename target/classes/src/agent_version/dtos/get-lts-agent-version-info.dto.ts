import { ApiProperty } from '@nestjs/swagger';
import { AgentVersion } from '../entities/agent_version.entity';

export class GetLTSAgentVersionInfoSuc {
  @ApiProperty()
  ok: true;

  @ApiProperty()
  result: AgentVersion;
}

export class GetLTSAgentVersionInfoFail {
  @ApiProperty()
  ok: false;

  @ApiProperty()
  error: string;
}
