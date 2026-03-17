import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import * as admin from 'firebase-admin';
import { AuthGuard } from 'guard/auth.guard';
import { UserData } from 'decorators/user.decorator';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationSwagger } from './notification.swagger';
import { SetFcmDto } from './dto/set-fcm.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@ApiTags('Notification')
@UseGuards(AuthGuard())
@Controller('v1/notification')
export class NotificationController {
  constructor(
    private readonly NotificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(
          /\\n/g,
          '\n',
        ),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  @NotificationSwagger.setFCM()
  @Put('set-fcm')
  setFCM(@UserData('user') user: User, @Body() body: SetFcmDto) {
    return this.NotificationService.setFCMToken(user, body.fcmToken);
  }

  @NotificationSwagger.sendNotification()
  @Post('send-notification')
  async sendNotification(@Body() body: SendNotificationDto) {
    return this.NotificationService.sendNotification(body);
  }

  @NotificationSwagger.getNotification()
  @Get('get-history')
  getNotification(@UserData('user') user: User) {
    return this.NotificationService.getNotification(user);
  }
}
