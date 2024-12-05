import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommandsModule } from './commands/commands.module';
// import { ScriptsController } from './scripts/scripts.controller';
// import { ScriptsService } from './scripts/scripts.service';
import { ScriptsModule } from './scripts/scripts.module';
import { ClassesModule } from './classes/classes.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { SearchModule } from './search/search.module';
import { ChatModule } from './chat/chat.module';
import { FileExploreModule } from './file-explore/file-explore.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    AuthModule,
    CommandsModule,
    ScriptsModule,
    ClassesModule,
    AssignmentsModule,
    NotificationsModule,
    AuditModule,
    SearchModule,
    ChatModule,
    FileExploreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
