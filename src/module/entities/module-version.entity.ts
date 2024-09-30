import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleInfo } from './module-info.entity';

@Entity()
@Unique(['module', 'version'])
@Index(['module', 'createdAt'])
export class ModuleVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  version: string;

  @Column()
  hash: string;

  @ManyToOne(() => ModuleInfo, (module) => module.versions, { nullable: false })
  module: ModuleInfo;

  @Column()
  moduleId: number;
}
