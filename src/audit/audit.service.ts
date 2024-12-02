import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable()
export class AuditService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(userId: string, action: string, details: string) {
    return this.logModel.create({ userId, action, details });
  }

  async getLogsForUser(userId: string) {
    return this.logModel.find({ userId }).sort({ timestamp: -1 });
  }

  async getAllLogs() {
    return this.logModel.find().sort({ timestamp: -1 });
  }
}
