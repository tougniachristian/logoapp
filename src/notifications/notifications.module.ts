import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRoot({
      transport: {
        service: 'Gmail', // true pour le port 465
        auth: {
          user: 'tougniadarel@gmail.com',
          pass: 'dxmj njts peyb qehd',
        },
      },
      defaults: {
        from: '"Support" <no-reply@example.com>',
      },
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
