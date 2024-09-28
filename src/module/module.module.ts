import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleInfo, User])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
