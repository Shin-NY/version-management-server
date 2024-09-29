import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ModuleInfo } from 'src/module/entities/module-info.entity';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { existsSync, mkdirSync } from 'fs';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get('/')
  async getModuleInfos(): Promise<ModuleInfo[]> {
    return this.moduleService.getModuleInfos();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('module', {
      storage: diskStorage({
        destination: function (req, _, cb) {
          const { name, version } = req.body;
          const path = `./uploaded_modules/${name}-${version}`;
          if (!existsSync(path)) mkdirSync(path, { recursive: true });
          cb(null, path);
        },
        filename: function (_, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadModule(@Body() body: ModuleInfo): Promise<void> {
    const { name, version, hash } = body;
    await this.moduleService.uploadModuleInfo(name, version, hash);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async downloadModule(@Param() params: any, @Res() res: Response) {
    const result = await this.moduleService.getModuleFile(params.id);
    if (result.ok) {
      const { file, filename } = result;
      res.set({
        'Content-Disposition': `attachment; filename=${filename}`,
      });
      file.pipe(res);
    }
  }
}
