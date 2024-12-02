import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Class, ClassSchema } from './schemas/class.schema';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Submission, SubmissionSchema } from './schemas/submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
