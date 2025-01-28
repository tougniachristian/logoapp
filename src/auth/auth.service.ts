import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  //ok
  async register(
    email: string,
    password: string,
    name: string,
    role?: string,
  ): Promise<any> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      console.log(existingUser);
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      // Génération d'un token de validation d'email
      const verificationToken = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '1h' },
      );

      // Envoi de l'email de validation
      await this.emailService.sendVerificationEmail(email, verificationToken);

      return {
        message: 'Inscription réussie. Veuillez vérifier votre email.',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  //ok
  async login(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });
    return { token, user };
  }

  //ok
  async verifyEmail(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.id);

      if (!user) throw new NotFoundException('Utilisateur non trouvé');
      if (user.isEmailVerified)
        throw new BadRequestException('Email déjà vérifié');

      user.isEmailVerified = true;
      await user.save();

      return { message: 'Email vérifié avec succès' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(userId: string, updates: Partial<User>) {
    const { email, password } = updates;

    if (email) {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new BadRequestException("L'email est déjà utilisé");
      }
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await this.userModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return { message: 'Compte supprimé avec succès' };
  }
}
