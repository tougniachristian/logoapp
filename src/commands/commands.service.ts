import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command } from './schemas/command.schema';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class CommandsService {
  constructor(
    @InjectModel(Command.name) private commandModel: Model<Command>,
    private readonly auditService: AuditService,
  ) {}

  async executeCommand(userId: string, command: string) {
    // Valide la commande et la stocke
    const validCommands = [
      'AV',
      'RE',
      'TD',
      'TG',
      'LC',
      'BC',
      'CT',
      'MT',
      'VE',
      'NETTOIE',
      'ORIGINE',
    ];
    const [cmd] = command.split(' ');

    if (!validCommands.includes(cmd)) {
      throw new Error('Commande non valide');
    }

    const newCommand = await this.commandModel.create({ userId, command });

    // Enregistrer l'événement dans les logs
    await this.auditService.createLog(
      userId,
      'COMMAND_EXECUTED',
      `Commande exécutée : ${command}`,
    );

    return { message: 'Commande exécutée', command: newCommand };
  }
}
