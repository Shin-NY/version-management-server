import { AgentVersion } from '../entities/agent_version.entity';

export class GetLTSAgentVersionInfoSuc {
  ok: true;
  result: AgentVersion;
}

export class GetLTSAgentVersionInfoFail {
  ok: false;
  error: string;
}
