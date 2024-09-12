import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './entities/message.entity';
import { ModuleInfo } from './entities/module-info.entity';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/messages')
  async getMessages(): Promise<Message[]> {
    return this.appService.getMessages();
  }

  @Get('api/modules')
  async getModules(): Promise<ModuleInfo[]> {
    return this.appService.getModules();
  }

  @Post('messages')
  @UseGuards(AuthGuard)
  async uploadMessage(@Req() req: Request): Promise<void> {
    const { title, message } = req.body as unknown as Pick<
      Message,
      'title' | 'message'
    >;
    await this.appService.uploadMessage(title, message);
  }

  @Post('modules')
  @UseGuards(AuthGuard)
  async uploadModule(@Req() req: Request): Promise<void> {
    const { name, version, hash } = req.body as unknown as ModuleInfo;
    await this.appService.uploadModuleInfo(name, version, hash);
  }
}
