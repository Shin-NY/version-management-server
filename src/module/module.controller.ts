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
import { CreateModuleVersionInput } from './dtos/create-module-version.dto';
import { CreateModuleInfoInput } from './dtos/create-module-info.dto';
import { GetVersionsFail, GetVersionsSuc } from './dtos/get-versions-dto';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async createModuleInfo(@Body() body: CreateModuleInfoInput) {
    return this.moduleService.createModuleInfo(body);
  }

  @Get('/')
  async getModuleInfos(): Promise<ModuleInfo[]> {
    return this.moduleService.getModuleInfos();
  }

  @Get('/:moduleId/versions')
  async getVersions(
    @Param() params: { moduleId: string },
  ): Promise<GetVersionsSuc | GetVersionsFail> {
    return this.moduleService.getVersions({
      moduleId: Number(params.moduleId),
    });
  }

  @Post('/:moduleId/versions')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, _, cb) {
          const { moduleId } = req.params as any;
          const { version } = req.body;
          const path = `./uploaded_modules/${moduleId}-${version}`;
          if (!existsSync(path)) mkdirSync(path, { recursive: true });
          cb(null, path);
        },
        filename: function (_, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async createModuleVersion(
    @Param() params: { moduleId: string },
    @Body() body: CreateModuleVersionInput,
  ): Promise<void> {
    await this.moduleService.createModuleVersion({
      ...body,
      moduleId: Number(params.moduleId),
    });
  }

  @Get('/versions/:versionId')
  @UseGuards(AuthGuard)
  async downloadModule(
    @Param() params: { versionId: string },
    @Res() res: Response,
  ) {
    const result = await this.moduleService.getModuleFile(
      Number(params.versionId),
    );
    if (result.ok) {
      const { file, filename } = result;
      res.set({
        'Content-Disposition': `attachment; filename=${filename}`,
      });
      file.pipe(res);
    }
  }
}
