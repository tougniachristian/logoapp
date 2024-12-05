import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
  Patch,
  Req,
} from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { SearchService } from '../search/search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Script } from './schemas/script.schema';

@UseGuards(JwtAuthGuard)
@Controller('scripts')
export class ScriptsController {
  constructor(
    private readonly scriptsService: ScriptsService,
    private readonly searchService: SearchService,
  ) {}

  // @Get('search')
  // async searchScripts(@Query('query') query: string) {
  //   const searchQuery = {
  //     query: {
  //       multi_match: {
  //         query,
  //         fields: ['title', 'content', 'tags'],
  //       },
  //     },
  //   };

  //   return this.searchService.search('scripts', searchQuery);
  // }

  @Post()
  async createScript(
    @Request() req,
    @Body()
    body: { title: string; content: string; isPublic: boolean; tags: string[] },
  ) {
    return this.scriptsService.createScript(
      req.user.id,
      body.title,
      body.content,
      body.isPublic,
      body.tags,
    );
  } // ok

  @Get()
  async getUserScripts(@Request() req) {
    return this.scriptsService.getUserScripts(req.user.id);
  }

  @Put(':id')
  async updateScript(
    @Request() req,
    @Param('id') id: string,
    @Body() updates: Partial<Script>,
  ) {
    return this.scriptsService.updateScript(req.user.id, id, updates);
  }

  @Delete(':id')
  async deleteScript(@Request() req, @Param('id') id: string) {
    return this.scriptsService.deleteScript(req.user.id, id);
  }

  @Get('search')
  async searchPublicScripts(@Query('tags') tags: string) {
    /*Ici je ne suis pas sur si le type est string[] ou string*/
    return this.scriptsService.searchPublicScripts(tags.split(','));
  }

  @Get('shared/:link')
  async getSharedScript(@Param('link') link: string) {
    return this.scriptsService.findBySharedLink(link);
  }

  @Patch('revoke-share/:id')
  async revokeShare(@Param('id') id: string, @Request() req) {
    await this.scriptsService.revokeSharedLink(id, req.user.id);
    return { message: 'Shared link revoked' };
  }

  @Patch(':targetId/import/:sourceId')
  async importScript(
    @Param('targetId') targetId: string,
    @Param('sourceId') sourceId: string,
    @Request() req,
  ) {
    return this.scriptsService.importScript(targetId, sourceId, req.user.id);
  }

  @Get('share/:id')
  async shareScript(@Param('id') id: string, @Req() req) {
    return this.scriptsService.generateSharedLink(id, req.user.id);
  }
}
