import { Module } from '@nestjs/common';
// import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './schemas/command.schema';
import { AuditModule } from 'src/audit/audit.module';
import { LogoService } from './services/logo.service';

@Module({
  imports: [
    AuditModule,
    MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
  ],
  providers: [LogoService],
  controllers: [CommandsController],
})
export class CommandsModule {}
