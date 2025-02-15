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
    return this.assignmentModel.find({ class: classId });
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    content: string,
    file?: string,
  ) {
    const assignment = await this.assignmentModel
      .findById(assignmentId)
      .populate('submissions')
      .populate({ path: 'class', populate: { path: 'teacherId' } });
    if (!assignment) throw new NotFoundException('Devoir introuvable');

    const existingSubmission = await this.submissionModel.findOne({
      assignment: assignmentId,
      student: studentId,
    });
    if (existingSubmission) {
      existingSubmission.isLate = new Date() > new Date(assignment.dueDate);
      existingSubmission.content = content; // Mise à jour de la soumission
    } else {
      const soumission = await this.submissionModel.create({
        assignment: assignmentId,
        student: studentId,
        content,
        isLate: new Date() > new Date(assignment.dueDate),
        file,
      });
      assignment.submissions.push(soumission);
    }

    await assignment.save();

    // Notification par email et push
    await this.notificationsService.notifyAssignmentSubmission(
      assignment.class.teacherId.email,
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
    const assignment = await this.assignmentModel
      .findById(assignmentId)
      .populate({ path: 'class', populate: { path: 'teacherId' } })
      .populate('submissions');
    if (!assignment) throw new NotFoundException('Devoir introuvable');

    if (assignment.class.teacherId._id.toString() !== teacherId)
      throw new UnauthorizedException('Action réservée au professeur');

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId,
    );
    if (!submission) throw new NotFoundException('Soumission non trouvée');

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();
    await assignment.save();
    await this.notificationsService.notifyGradeAssigned(
      submission.student.email,
      assignment.title,
      grade,
    );
    return { message: 'Note attribuée avec succès' };
  }

  async getProgressForClass(assignmentId: string, teacherId: string) {
    const assignment = await this.assignmentModel
      .findById(assignmentId)
      .populate({ path: 'class', populate: { path: 'teacherId' } })
      .populate('submissions');
    if (!assignment) throw new NotFoundException('Devoir introuvable');
    if (assignment.class.teacherId._id.toString() !== teacherId)
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
    filePaths?: string[],
    dueDate?: Date,
    logoScriptToComplete?: string,
  ): Promise<Assignment> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    const assignment = new this.assignmentModel({
      class: classId,
      teacherId,
      title,
      description,
      dueDate,
      submissions: [],
      files: filePaths,
      logoScriptToComplete,
    });
    const saved = await assignment.save();
    await this.classModel.findByIdAndUpdate(classId, {
      $addToSet: { assignments: assignment._id },
    });

    Promise.all(
      classData.students.map(
        async (student) =>
          await this.notificationsService.notifyCreateAssignment(
            student.email,
            assignment.title,
          ),
      ),
    );

    return saved;
  }
}
