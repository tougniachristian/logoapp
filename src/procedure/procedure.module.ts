import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Procedure,
  ProcedureSchema,
} from 'src/commands/schemas/procedure.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Procedure.name, schema: ProcedureSchema },
    ]),
  ],
  providers: [ProcedureService],
  controllers: [ProcedureController],
})
export class ProcedureModule {}
