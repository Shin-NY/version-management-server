import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class LoginInput extends PickType(User, ['username', 'password']) {}

export class LoginSuccessRes {
  @ApiProperty()
  ok: true;

  @ApiProperty()
  token: string;
}

export class LoginFailRes {
  @ApiProperty()
  ok: false;

  @ApiProperty()
  error: string;
}
