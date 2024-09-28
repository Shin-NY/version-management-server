import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAccountFailRes,
  CreateAccountSuccessRes,
} from 'src/auth/dtos/create-account.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginFailRes, LoginSuccessRes } from 'src/auth/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HASH_ROUNDS } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(
    username: string,
    password: string,
  ): Promise<CreateAccountSuccessRes | CreateAccountFailRes> {
    try {
      //나중에 어드민만 검색하도록 수정
      const existingUsers = await this.usersRepo.find();
      if (existingUsers.length > 0) {
        return { ok: false, error: 'account already exists' };
      }

      const hashed = await bcrypt.hash(password, HASH_ROUNDS);
      const newUser = this.usersRepo.create({
        username,
        password: hashed,
      });
      await this.usersRepo.save(newUser);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'create account failed' };
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<LoginSuccessRes | LoginFailRes> {
    try {
      const user = await this.usersRepo.findOneBy({
        username,
      });
      if (!user) return { ok: false, error: 'username not found' };

      const match = await bcrypt.compare(password, user.password);
      if (!match) return { ok: false, error: 'password not valid' };

      const token = this.jwtService.sign({ userId: user.id });
      return { ok: true, token };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'login failed' };
    }
  }
}
