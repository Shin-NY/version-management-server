import { StreamableFile } from '@nestjs/common';

export class GetLTSAgentSuc extends StreamableFile {}

export class GetLTSAgentFail {
  ok: false;
  error: string;
}
