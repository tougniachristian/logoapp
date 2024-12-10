import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Class, ClassSchema } from './schemas/class.schema';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: Submission.name, schema: SubmissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
