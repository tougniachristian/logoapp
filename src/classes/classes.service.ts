import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from './schemas/class.schema';
import * as bcrypt from 'bcrypt';
// import { Submission } from './schemas/submission.schema';
// import generateUniqueId from 'generate-unique-id';
import { User } from 'src/auth/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    // @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    private readonly notificationsService: NotificationsService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getClassById(classId: string, userId: string) {
    const classData = await this.classModel
      .findById(classId)
      .populate('teacherId')
      .populate('students')
      .populate('coTeachers')
      .populate('assignments');
    if (!classData) throw new NotFoundException('Classe introuvable');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if ([...classData.coTeachers, ...classData.students].includes(user.id)) {
      throw new UnauthorizedException('Accès refusé');
    }
    return classData;
  }

  async joinClass(link: string, userId: string) {
    const classData = await this.classModel.findOne({ link });
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
    return this.classModel
      .find({
        $or: [
          { teacherId: userId },
          { coTeachers: userId },
          { students: userId },
        ],
      })
      .populate('teacherId')
      .populate('students')
      .populate('coTeachers')
      .populate('assignments');
  }

  async updateClass(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    const updatedClass = await this.classModel
      .findByIdAndUpdate(id, updateClassDto, { new: true })
      .exec();
    if (!updatedClass) {
      throw new NotFoundException('Class not found');
    }
    return updatedClass;
  }

  async deleteClass(id: string): Promise<any> {
    const result = await this.classModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Class not found');
    }
    return { message: 'Class deleted successfully' };
  }

  async createClass(teacherId: string, name: string): Promise<any> {
    const newClass = new this.classModel({
      teacherId,
      name,
      link: uuidv4(),
      password: await bcrypt.hash(uuidv4(), 10), // Génération et hashage du mot de passe
    });
    await newClass.save();
    return { message: 'Class saved successfully' };
  }

  async addStudent(classId: string, emails: string[]): Promise<any> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    const students = await this.userModel.find({ email: { $in: emails } });

    if (!students.length) throw new NotFoundException('Aucun élève trouvé');

    const studentIds = students.map((student) => student.id);

    try {
      await this.classModel.findByIdAndUpdate(
        classId,
        { $addToSet: { students: { $each: studentIds } } }, // Ajout en lot
        { new: true },
      );
      // Notification par email et push
      // Envoyer une notification à chaque étudiant ajouté
      for (const student of students) {
        await this.notificationsService.notifyAddedToClass(
          student.email,
          classData.name,
        );
      }

      return { message: `${students.length} élèves ajoutés avec succès` };
    } catch (error) {
      throw new Error("Erreur lors de l'ajout de l'élève" + error);
    }
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

  async removeCoTeacher(classId: string, coTeacherId: string): Promise<Class> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    return await this.classModel.findByIdAndUpdate(
      classId,
      { $pull: { coTeachers: coTeacherId } },
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

  async retrogradetoStudent(
    classId: string,
    teacherId: string,
    coTeacherId: string,
  ): Promise<Class> {
    const classData = await this.classModel.findById(classId);
    if (!classData) throw new NotFoundException('Classe introuvable');
    if (classData.teacherId.toString() !== teacherId)
      throw new UnauthorizedException('Action réservée au professeur');
    const user = await this.userModel.findById(coTeacherId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (!classData.coTeachers.includes(user.id))
      throw new NotFoundException('Élève introuvable');
    return await this.classModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { students: coTeacherId },
        $pull: { coTeachers: coTeacherId },
      },
      { new: true },
    );
  }
}
