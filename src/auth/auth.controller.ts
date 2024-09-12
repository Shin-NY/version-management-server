import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginFailRes, LoginSuccessRes } from 'src/dtos/login.dto';
import { User } from 'src/entities/user.entity';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* @Post('/create-account')
async createAccount(
  @Req() req: Request,
): Promise<CreateAccountSuccessRes | CreateAccountFailRes> {
  const { username, password } = req.body as unknown as Pick<
    User,
    'username' | 'password'
  >;
  return await this.authService.createAccount(username, password);
} */

  @Post('/')
  async login(@Req() req: Request): Promise<LoginSuccessRes | LoginFailRes> {
    const { username, password } = req.body as unknown as Pick<
      User,
      'username' | 'password'
    >;
    return await this.authService.login(username, password);
  }
}
