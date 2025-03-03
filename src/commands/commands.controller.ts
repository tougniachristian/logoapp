import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Delete,
} from '@nestjs/common';
// import { CommandsService } from './commands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandsService } from './commands.service';
import { Command } from './schemas/command.schema';

@UseGuards(JwtAuthGuard)
@Controller('commands')
export class CommandsController {
  constructor(private readonly logoService: CommandsService) {}

  @Post()
  async create(
    @Body('command') command: string,
    @Request() req,
  ): Promise<Command> {
    return this.logoService.create(command, req.user.id);
  }

  @Get()
  async findAll(): Promise<Command[]> {
    return this.logoService.findAll();
  }

  @Delete()
  async clear() {
    return this.logoService.clearAll();
  }
}
