import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentVersionFormData {
  version: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: Express.Multer.File[];
}

export class CreateAgentVersionInput {
  version: string;
}

export class CreateAgentVersionSuc {
  @ApiProperty()
  ok: true;
}

export class CreateAgentVersionFail {
  @ApiProperty()
  ok: false;

  @ApiProperty()
  error: string;
}
