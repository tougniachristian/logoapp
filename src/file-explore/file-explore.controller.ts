import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FileExploreService } from './file-explore.service';

@Controller('file-explore')
export class FileExploreController {
  constructor(private readonly fileService: FileExploreService) {}

  @Get()
  async listFiles(@Query('directory') directory: string) {
    return this.fileService.listFiles(directory);
  }

  @Get(':filename')
  async readFile(@Param('filename') filename: string) {
    return this.fileService.readFile(filename);
  }

  @Post()
  async writeFile(@Body() body: { filename: string; content?: string }) {
    if (body.content) {
      await this.fileService.writeFile(body.filename, body.content);
    } else {
      await this.fileService.createDirectory(body.filename);
    }
  }

  @Put(':filename')
  async updateFile(
    @Param('filename') filename: string,
    @Body() body: { content: string },
  ) {
    await this.fileService.writeFile(filename, body.content);
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.fileService.deleteFile(filename);
  }
}