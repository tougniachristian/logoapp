import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  async sendPushNotification(deviceId: string, title: string, message: string) {
    const apiUrl = 'https://onesignal.com/api/v1/notifications';
    const appId = '50aa316d-4f2b-4455-b4f0-8ad192c2f83b';
    const apiKey =
      'os_v2_app_kcvdc3kpfncflnhqrlizfqxyhpee4zpzkfhetevqvezigghvrl3qbhqi5xenbowtqorqgjl3cyc6pkpl5jxyv6qf32f3hulc3ekancq';

    try {
      const response = await this.httpService
        .post(
          apiUrl,
          {
            app_id: appId,
            include_player_ids: [deviceId],
            headings: { en: title },
            contents: { en: message },
          },
          {
            headers: {
              Authorization: `Basic ${apiKey}`,
            },
          },
        )
        .toPromise();

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
      });
      return { message: 'Email envoyé avec succès' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async notifyAssignmentSubmission(email: string, assignmentTitle: string) {
    const subject = `Nouvelle soumission pour le devoir : ${assignmentTitle}`;
    const text = `Un élève a soumis le devoir : ${assignmentTitle}. Veuillez vérifier votre tableau de bord.`;
    return this.sendEmail(email, subject, text);
  }

  async notifyGradeAssigned(
    email: string,
    assignmentTitle: string,
    grade: number,
  ) {
    const subject = `Note attribuée pour le devoir : ${assignmentTitle}`;
    const text = `Vous avez reçu une note de ${grade} pour le devoir : ${assignmentTitle}.`;
    return this.sendEmail(email, subject, text);
  }
}
