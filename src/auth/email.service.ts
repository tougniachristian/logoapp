import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // true pour le port 465
      auth: {
        user: 'tougniadarel@gmail.com',
        pass: 'dxmj njts peyb qehd',
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `http://localhost:4000/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: '"Support LogoApp" <support@logoapp.com>',
      to,
      subject: 'Vérification de votre compte',
      html: `<p>Merci de vous inscrire ! Veuillez vérifier votre adresse email en cliquant sur ce lien :</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
