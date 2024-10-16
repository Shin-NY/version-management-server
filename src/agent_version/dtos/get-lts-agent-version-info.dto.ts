import { AgentVersion } from '../entities/agent_version.entity';

/**
 * 어떤 파일을 선택할 수 있는지 리스트 반환하기 위한 dto
 */
export class GetLTSAgentVersionInfoSuc {
  ok: true;
  result: {
    version: string;
    createdAt: Date;
    files: string[];
  };
}

export class GetLTSAgentVersionInfoFail {
  ok: false;
  error: string;
}
