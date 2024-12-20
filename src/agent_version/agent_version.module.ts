import { Module } from '@nestjs/common';
import { AgentVersionService } from './agent_version.service';
import { AgentVersionController } from './agent_version.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentVersion } from './entities/agent_version.entity';
import { User } from 'src/auth/entities/user.entity';
import { AgentFileInfo } from './entities/agent_file_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgentVersion, User, AgentFileInfo])],
  providers: [AgentVersionService],
  controllers: [AgentVersionController],
})
export class AgentVersionModule {}
