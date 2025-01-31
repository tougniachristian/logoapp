import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command } from '../schemas/command.schema';
import { AuditService } from 'src/audit/audit.service';

export interface CommandeLogo {
  nom: string;
  params?: any[];
}

export class EtatTortue {
  x: number = 0;
  y: number = 0;
  direction: number = 0;
  crayonBaisse: boolean = true;
  couleurTrait: string = '#000000';
  largeurTrait: number = 1;
  couleurRemplissage: string = '#FFFFFF';

  reset() {
    this.x = 0;
    this.y = 0;
    this.direction = 0;
    this.crayonBaisse = true;
    this.couleurTrait = '#000000';
    this.largeurTrait = 1;
    this.couleurRemplissage = '#FFFFFF';
  }
}

@Injectable()
export class LogoService {
  private etat: EtatTortue;
  private historique: CommandeLogo[] = [];
  private procedures: Map<
    string,
    { params: string[]; commandes: CommandeLogo[] }
  > = new Map();

  constructor(
    @InjectModel(Command.name) private commandModel: Model<Command>,
    private readonly auditService: AuditService,
  ) {
    this.etat = new EtatTortue();
  }

  async executeCommande(
    userId: string,
    commande: CommandeLogo,
  ): Promise<EtatTortue | { x: number; y: number }> {
    this.historique.push(commande);

    const { nom, params } = commande;

    switch (nom.toUpperCase()) {
      case 'AV':
        this.avancer(params[0]);
        break;
      case 'RE':
        this.reculer(params[0]);
        break;
      case 'TD':
        this.tournerDroite(params[0]);
        break;
      case 'TG':
        this.tournerGauche(params[0]);
        break;
      case 'LC':
        this.etat.crayonBaisse = false;
        break;
      case 'BC':
        this.etat.crayonBaisse = true;
        break;
      case 'CT':
        this.etat.couleurTrait = params[0];
        break;
      case 'MT':
        this.etat.largeurTrait = params[0];
        break;
      case 'VE':
      case 'NETTOIE':
        this.etat.reset();
        this.historique = [];
        break;
      case 'ORIGINE':
        this.etat.x = 0;
        this.etat.y = 0;
        break;
      case 'VT':
        this.etat.x = params[0];
        this.etat.y = params[1];
        break;
      case 'FCC':
        this.etat.couleurRemplissage = params[0];
        break;
      case 'CAP':
        this.etat.direction = params[0];
        break;
      case 'POSITION':
        return { x: this.etat.x, y: this.etat.y };
      case 'FCB':
        this.fixerCouleurBord(params[0]);
        break;
      case 'FCAP':
        this.fixerCap(params[0]);
        break;
      case 'FPOS':
        this.fixerPosition(params[0], params[1]);
        break;
      case 'REPETE':
        this.repete(userId, params[0], params[1]);
        break;
      default:
        throw new Error(`Commande inconnue : ${nom}`);
    }

    await this.commandModel.create({
      userId,
      params,
      name: nom,
    });

    await this.auditService.createLog(
      userId,
      'COMMAND_EXECUTED',
      `Commande exécutée : ${nom}`,
    );

    return this.getEtat();
  }

  repete(userId: string, nb: number, commandes: CommandeLogo[]): EtatTortue {
    for (let i = 0; i < nb; i++) {
      for (const cmd of commandes) {
        this.executeCommande(userId, cmd);
      }
    }
    // console.log(this.etat);
    return this.getEtat();
  }

  getEtat(): EtatTortue {
    return { ...this.etat } as EtatTortue; // Retourne une copie de l'état actuel
  }

  definirProcedure(nom: string, params: string[], commandes: CommandeLogo[]) {
    const existProcedure = this.procedures.get(nom);
    if (existProcedure) {
      throw new BadRequestException('Une procédure avec ce nom existe déjà.');
    }
    this.procedures.set(nom, { params, commandes });
  }

  async executerProcedure(
    userId: string,
    nom: string,
    params: any[],
  ): Promise<EtatTortue> {
    const procedure = this.procedures.get(nom);
    if (!procedure) throw new Error(`Procédure inconnue : ${nom}`);

    const { params: paramNames, commandes } = procedure;

    const commandesAvecValeurs = commandes.map((commande) => {
      const commandeClone = { ...commande };
      if (commande.params) {
        commandeClone.params = commande.params.map((param: any) =>
          typeof param === 'string' && paramNames.includes(param)
            ? params[paramNames.indexOf(param)]
            : param,
        );
      }
      return commandeClone;
    });

    for (const cmd of commandesAvecValeurs) {
      this.executeCommande(userId, cmd);
    }
    return this.getEtat();
  }

  hisoriquelocale(): CommandeLogo[] {
    return this.historique;
  }

  async obtenirHistorique(id: string): Promise<CommandeLogo[]> {
    return await this.commandModel.find({ id: id });
  }

  private avancer(unites: number) {
    const radians = (this.etat.direction * Math.PI) / 180;
    this.etat.x += unites * Math.cos(radians);
    this.etat.y += unites * Math.sin(radians);
  }

  private reculer(unites: number) {
    this.avancer(-unites);
  }

  private tournerDroite(angle: number) {
    this.etat.direction = (this.etat.direction + angle) % 360;
  }

  private tournerGauche(angle: number) {
    this.etat.direction = (this.etat.direction - angle + 360) % 360;
  }

  private fixerCouleurBord(couleur: string): void {
    this.etat.couleurTrait = couleur;
  }

  private fixerCap(angle: number): void {
    this.etat.direction = angle % 360;
  }

  private fixerPosition(x: number, y: number): void {
    this.etat.x = x;
    this.etat.y = y;
  }
}
