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
    @Body() body: { commandes: CommandeLogo[] },
  ) {
    try {
      const etat = this.logoService.repete(req.user.id, nb, body.commandes);
      return {
        message: 'Commande répétée avec succès',
        etat,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('procedure')
  definirProcedure(
    @Body() body: { nom: string; params: string[]; commandes: CommandeLogo[] },
  ) {
    this.logoService.definirProcedure(body.nom, body.params, body.commandes);
    return { message: `Procédure "${body.nom}" définie avec succès` };
  }

  @Post('procedure/executer')
  async executerProcedure(
    @Request() req,
    @Body() body: { nom: string; params: any[] },
  ) {
    try {
      const etat = await this.logoService.executerProcedure(
        req.user.id,
        body.nom,
        body.params,
      );
      return {
        message: `Procédure "${body.nom}" exécutée avec succès`,
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
