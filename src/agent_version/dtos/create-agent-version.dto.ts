export class CreateAgentVersionInput {
  version: string;
}

export class CreateAgentVersionSuc {
  ok: true;
}

export class CreateAgentVersionFail {
  ok: false;
  error: string;
}
