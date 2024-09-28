import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get('/')
  async getModules(): Promise<ModuleInfo[]> {
    return this.moduleService.getModules();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async uploadModule(@Req() req: Request): Promise<void> {
    const { name, version, hash } = req.body as unknown as ModuleInfo;
    await this.moduleService.uploadModuleInfo(name, version, hash);
  }
}
