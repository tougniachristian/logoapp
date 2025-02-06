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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './auth/guards/roles.guard';
// import { ProcedureService } from './procedure/procedure.service';
// import { ProcedureController } from './procedure/procedure.controller';
import { ProcedureModule } from './procedure/procedure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    MulterModule.register({
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    AuthModule,
    CommandsModule,
    ScriptsModule,
    ClassesModule,
    AssignmentsModule,
    NotificationsModule,
    ProcedureModule,
    AuditModule,
    SearchModule,
    ChatModule,
    FileExploreModule,
    ProcedureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ProcedureService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
