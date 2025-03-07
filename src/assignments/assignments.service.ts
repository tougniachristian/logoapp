import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from './schemas/assignment.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { Class } from 'src/classes/schemas/class.schema';
import { Submission } from 'src/classes/schemas/submission.schema';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getAssignmentsForClass(classId: string) {
    return this.assignmentModel.find({ classId });
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    content: string,
  ) {
    const assignment = await this.assignmentModel.findById(assignmentId);
    if (!assignment) throw new NotFoundException('Devoir introuvable');

    const existingSubmission = assignment.submissions.find(
      (s) => s.student.toString() === studentId,
    );
    if (existingSubmission) {
      existingSubmission.isLate = new Date() > new Date(assignment.dueDate);
      existingSubmission.content = content; // Mise à jour de la soumission
    } else {
      const soumission = await this.submissionModel.create({
        assignment: assignmentId,
        student: studentId,
        content,
        isLate: new Date() > new Date(assignment.dueDate),
      });
      assignment.submissions.push(soumission);
    }

    await assignment.save();

    // Notification par email et push
    await this.notificationsService.notifyAssignmentSubmission(
      assignment.class.teacherId,
      assignment.title,
    );
    return { message: 'Devoir soumis avec succès' };
  }

  async gradeSubmission(
    assignmentId: string,
    teacherId: string,
    studentId: string,
    grade: number,
    feedback: string,
  ) {
    const assignment = await this.assignmentModel.findById(assignmentId);
    if (!assignment) throw new NotFoundException('Devoir introuvable');
    if (assignment.class.teacherId !== teacherId)
      throw new UnauthorizedException('Action réservée au professeur');

    const submission = assignment.submissions.find(
      (s) => s.student.id === studentId,
    );
    if (!submission) throw new NotFoundException('Soumission non trouvée');

    submission.grade = grade;
    submission.feedback = feedback;
    await assignment.save();
    return { message: 'Note attribuée avec succès' };
  }

  async getProgressForClass(assignmentId: string, teacherId: string) {
    const assignment = await this.assignmentModel.findById(assignmentId);
    if (!assignment) throw new NotFoundException('Devoir introuvable');
    if (assignment.class.teacherId !== teacherId)
      throw new UnauthorizedException('Action réservée au professeur');

    return assignment.submissions.map((s) => ({
      studentId: s.student,
      submitted: !!s.content,
      grade: s.grade || null,
    }));
  }

  async createAssignment(
    classId: string,
    teacherId: string,
    title: string,
    description: string,
  ): Promise<Assignment> {
    const assignment = new this.assignmentModel({
      class: classId,
      teacherId,
      title,
      description,
      submissions: [],
    });
    await assignment.save();
    await this.classModel.findByIdAndUpdate(classId, {
      $addToSet: { assignments: assignment._id },
    });
    return assignment;
  }
}
