import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateAccountInput extends PickType(User, [
  'username',
  'password',
]) {}

export class CreateAccountSuccessRes {
  @ApiProperty()
  ok: true;
}

export class CreateAccountFailRes {
  @ApiProperty()
  ok: false;

  @ApiProperty()
  error: string;
}
