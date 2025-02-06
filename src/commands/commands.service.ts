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

  async create(command: string, id: string): Promise<Command> {
    const createdCommand = new this.commandModel({
      userId: id,
      command,
    });
    return createdCommand.save();
  }

  async findAll(): Promise<Command[]> {
    return this.commandModel.find().populate('userId').exec();
  }
}
