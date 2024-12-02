import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Class, ClassSchema } from 'src/classes/schemas/class.schema';
import {
  Submission,
  SubmissionSchema,
} from 'src/classes/schemas/submission.schema';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
