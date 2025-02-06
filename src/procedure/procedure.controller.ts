import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { Procedure } from 'src/commands/schemas/procedure.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('procedure')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}
  @Post()
  async create(
    @Body('name') name: string,
    @Body('commands') commands: string[],
    @Body('params') params: string[],
    @Request() req,
  ): Promise<Procedure> {
    return this.procedureService.create(name, commands, params, req.user.id);
  }

  @Get()
  async findAll(@Request() req): Promise<Procedure[]> {
    return this.procedureService.findAll(req.user.id);
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<Procedure> {
    return this.procedureService.findByName(name);
  }

  @Put(':name/use')
  async updateLastUsed(@Param('name') name: string): Promise<Procedure> {
    return this.procedureService.updateLastUsed(name);
  }
}
