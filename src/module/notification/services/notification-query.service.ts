import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NotificationQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { user: { some: { id: userId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setFcmToken(userId: string, fcmToken: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { fcmToken } });
    return { message: 'FCM token updated' };
  }
}
