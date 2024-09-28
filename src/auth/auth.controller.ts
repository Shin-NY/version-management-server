import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginFailRes, LoginSuccessRes } from 'src/auth/dtos/login.dto';
import { User } from 'src/auth/entities/user.entity';
import {
  CreateAccountFailRes,
  CreateAccountSuccessRes,
} from 'src/auth/dtos/create-account.dto';
import { Response } from 'express';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create-account')
  async createAccount(
    @Req() req: Request,
  ): Promise<CreateAccountSuccessRes | CreateAccountFailRes> {
    const { username, password } = req.body as unknown as Pick<
      User,
      'username' | 'password'
    >;
    return await this.authService.createAccount(username, password);
  }

  @Post('/login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessRes | LoginFailRes> {
    const { username, password } = req.body as unknown as Pick<
      User,
      'username' | 'password'
    >;
    const loginRes = await this.authService.login(username, password);
    if ('token' in loginRes) res.cookie('token', loginRes.token);
    return loginRes;
  }
}
