import {
  Controller,
  Get,
  //   Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserLogs(@Request() req) {
    return this.auditService.getLogsForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @Get('all')
  async getAllLogs(@Request() req) {
    // Exemple : autoriser uniquement les administrateurs
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Accès réservé aux administrateurs');
    }
    return this.auditService.getAllLogs();
  }
}
