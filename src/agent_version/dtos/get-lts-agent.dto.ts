import { StreamableFile } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class GetLTSAgentInput {
  filenames: string[];
}

export class GetLTSAgentSuc extends StreamableFile {}

export class GetLTSAgentFail {
  @ApiProperty()
  ok: false;

  @ApiProperty()
  error: string;
}
