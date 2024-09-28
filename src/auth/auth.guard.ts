import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import 'dotenv/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.cookies?.token;

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_KEY,
      });
      if (!payload?.userId) throw new UnauthorizedException();
      const user = await this.usersRepo.findOneBy({ username: payload.id });
      if (!user) throw new UnauthorizedException();

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
