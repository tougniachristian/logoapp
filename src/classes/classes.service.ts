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
// import generateUniqueId from 'generate-unique-id';
import { User } from 'src/auth/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getClassById(classId: string, userId: string) {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if ([...classData.coTeachers, ...classData.students].includes(user.id)) {
      throw new UnauthorizedException('Accès refusé');
    }
    return classData;
  }

  async joinClass(classId: string, link: string, userId: string) {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (classData.link !== link)
      throw new UnauthorizedException('Lien incorrect');

    if (!classData.students.includes(user.id)) {
      classData.students.push(user);
      await classData.save();
    } else {
      throw new UnauthorizedException('Utilisateur déjà inscrit');
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
      link: uuidv4(),
      password: await bcrypt.hash(uuidv4(), 10), // Génération et hashage du mot de passe
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
    const user = await this.userModel.findById(studentId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (!classData.students.includes(user.id))
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
