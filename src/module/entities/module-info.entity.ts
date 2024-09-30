import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleVersion } from './module-version.entity';

@Entity()
export class ModuleInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @OneToMany(() => ModuleVersion, (version) => version.module)
  versions: ModuleVersion[];
}
