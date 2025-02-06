import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Procedure } from 'src/commands/schemas/procedure.model';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectModel(Procedure.name) private procedureModel: Model<Procedure>,
  ) {}

  async create(
    name: string,
    commands: string[],
    params: string[],
    id: string,
  ): Promise<Procedure> {
    const createdProcedure = new this.procedureModel({
      name,
      commands,
      userId: id,
    });
    return createdProcedure.save();
  }

  async findAll(id: string): Promise<Procedure[]> {
    return this.procedureModel.find({ userId: id }).populate('userId').exec();
  }

  async findByName(name: string): Promise<Procedure> {
    return this.procedureModel.findOne({ name }).populate('userId').exec();
  }

  async updateLastUsed(name: string): Promise<Procedure> {
    return this.procedureModel
      .findOneAndUpdate({ name }, { lastUsed: new Date() }, { new: true })
      .populate('userId')
      .exec();
  }
}
