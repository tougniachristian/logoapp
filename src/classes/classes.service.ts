import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from './schemas/class.schema';
import * as bcrypt from 'bcrypt';
import { Submission } from './schemas/submission.schema';
import generateUniqueId from 'generate-unique-id';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async getClassById(classId: string, userId: string) {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    if (
      ![
        classData.teacherId,
        ...classData.coTeachers,
        ...classData.students,
      ].includes(userId)
    ) {
      throw new UnauthorizedException('Accès refusé');
    }
    return classData;
  }

  async joinClass(classId: string, password: string, userId: string) {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    if (classData.password !== password)
      throw new UnauthorizedException('Mot de passe incorrect');

    if (!classData.students.includes(userId)) {
      classData.students.push(userId);
      await classData.save();
    }

    return { message: 'Ajouté à la classe avec succès' };
  }

  async getClassesForUser(userId: string) {
    return this.classModel.find({
      $or: [
        { teacherId: userId },
        { coTeachers: userId },
        { students: userId },
      ],
    });
  }

  async createClass(teacherId: string, name: string): Promise<Class> {
    const newClass = new this.classModel({
      teacherId,
      name,
      link: generateUniqueId({ length: 10 }),
      password: await bcrypt.hash(generateUniqueId({ length: 6 }), 10), // Génération et hashage du mot de passe
    });
    return await newClass.save();
  }

  async addStudent(classId: string, studentId: string): Promise<Class> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    return await this.classModel.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } },
      { new: true },
    );
  }

  async removeStudent(classId: string, studentId: string): Promise<Class> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    return await this.classModel.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true },
    );
  }

  async promoteToCoTeacher(
    classId: string,
    teacherId: string,
    studentId: string,
  ): Promise<Class> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    if (classData.teacherId.toString() !== teacherId)
      throw new UnauthorizedException('Action réservée au professeur');
    if (!classData.students.includes(studentId))
      throw new NotFoundException('Élève introuvable');
    return await this.classModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { coTeachers: studentId },
        $pull: { students: studentId },
      },
      { new: true },
    );
  }
}
