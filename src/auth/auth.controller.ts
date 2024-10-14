import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginFailRes,
  LoginInput,
  LoginSuccessRes,
} from 'src/auth/dtos/login.dto';
import {
  CreateAccountFailRes,
  CreateAccountInput,
  CreateAccountSuccessRes,
} from 'src/auth/dtos/create-account.dto';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('/')
@ApiExtraModels(
  LoginSuccessRes,
  LoginFailRes,
  CreateAccountSuccessRes,
  CreateAccountFailRes,
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 계정을 생성합니다
   */
  @Post('/create-account')
  @ApiCreatedResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateAccountSuccessRes) },
        { $ref: getSchemaPath(CreateAccountFailRes) },
      ],
    },
  })
  async createAccount(
    @Body() input: CreateAccountInput,
  ): Promise<CreateAccountSuccessRes | CreateAccountFailRes> {
    return await this.authService.createAccount(input.username, input.password);
  }

  /**
   * 로그인 후 token을 받습니다
   */
  @ApiCreatedResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(LoginSuccessRes) },
        { $ref: getSchemaPath(LoginFailRes) },
      ],
    },
  })
  @Post('/login')
  async login(
    @Body() input: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessRes | LoginFailRes> {
    const loginRes = await this.authService.login(
      input.username,
      input.password,
    );
    if ('token' in loginRes) res.cookie('token', loginRes.token);
    return loginRes;
  }
}
