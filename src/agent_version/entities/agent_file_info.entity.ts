import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentVersion } from './agent_version.entity';

@Entity()
export class AgentFileInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AgentVersion, (version) => version.fileInfos)
  version: AgentVersion;

  @Column()
  filename: string;

  @Column()
  hash: string;
}
