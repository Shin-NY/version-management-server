import { ModuleVersion } from '../entities/module-version.entity';

export class GetVersionsInput {
  moduleId: number;
}

export class GetVersionsSuc {
  ok: true;
  result: ModuleVersion[];
}

export class GetVersionsFail {
  ok: false;
}
