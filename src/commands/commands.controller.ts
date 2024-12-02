import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Request,
} from '@nestjs/common';
// import { CommandsService } from './commands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandeLogo, LogoService } from './services/logo.service';

@UseGuards(JwtAuthGuard)
@Controller('commands')
export class CommandsController {
  constructor(private readonly logoService: LogoService) {}

  @Post('execute')
  async executeCommande(@Request() req, @Body() commande: CommandeLogo) {
    try {
      const etat = await this.logoService.executeCommande(
        req.user.id,
        commande,
      );
      return {
        message: 'Commande exécutée avec succès',
        etat,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('repete/:nb')
  async repete(
    @Request() req,
    @Param('nb') nb: number,
    @Body() commandes: CommandeLogo[],
  ) {
    try {
      const etat = await this.logoService.repete(req.user.id, nb, commandes);
      return {
        message: 'Commande répétée avec succès',
        etat,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('procedure/:nom')
  definirProcedure(
    @Param('nom') nom: string,
    @Body() commandes: CommandeLogo[],
  ) {
    this.logoService.definirProcedure(nom, commandes);
    return { message: `Procédure "${nom}" définie avec succès` };
  }

  @Post('procedure/executer/:nom')
  async executerProcedure(@Request() req, @Param('nom') nom: string) {
    try {
      const etat = await this.logoService.executerProcedure(req.user.id, nom);
      return {
        message: `Procédure "${nom}" exécutée avec succès`,
        etat,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('historique-local')
  historiqueLocale() {
    return this.logoService.hisoriquelocale();
  }

  @Get('historique-db')
  async obtenirHistorique() {
    return await this.logoService.obtenirHistorique();
  }

  @Get('etat')
  obtenirEtat() {
    return this.logoService.getEtat();
  }
}
