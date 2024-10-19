import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentFileInfo } from './agent_file_info.entity';

@Entity()
export class AgentVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  version: string;

  @OneToMany(() => AgentFileInfo, (fileInfo) => fileInfo.version)
  fileInfos: AgentFileInfo[];
}
