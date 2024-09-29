import { ReadStream } from 'fs';

export class GetModuleFileSuc {
  ok: true;
  filename: string;
  file: ReadStream;
}

export class GetModuleFileFail {
  ok: false;
}
