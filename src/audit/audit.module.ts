import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Log, LogSchema } from './schemas/log.schema';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
