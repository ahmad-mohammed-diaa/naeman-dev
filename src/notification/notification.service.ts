import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppSuccess } from 'src/utils/AppSuccess';
import * as admin from 'firebase-admin';
// Local storage for users

@Injectable()
export class NotificationService {
  constructor(readonly prisma: PrismaService) {
    // Initialize Firebase Admin SDK here if needed
  }
  private secret = process.env.JWT_SECRET;

  async setFCMToken(user: User, fcmToken: string) {
    const token = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        fcmToken,
      },
    });
    admin.messaging().subscribeToTopic(fcmToken, 'packages');

    return new AppSuccess(
      { token: token.fcmToken },
      'FCM token updated successfully',
    );
  }

  async getNotification(user: User) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        user: { some: { id: user.id } },
      },
    });
    return new AppSuccess(
      { notifications },
      'Notifications retrieved successfully',
    );
  }

  async sendNotification(body: {
    fcmTokens: string[]; // ✅ Must be a string, not an array
    title: string;
    message: string;
    imageUrl?: string;
  }) {
    const message = {
      to: body.fcmTokens, // ✅ Must be a string, not an array
      notification: {
        title: body.title,
        body: body.message,
      },
    };
    const user = await this.prisma.user.findFirst({
      where: { fcmToken: body.fcmTokens[0] },
    });

    if (!user) {
      throw new NotFoundException('User not found with the provided FCM token');
    }

    try {
      const [noti] = await Promise.all([
        admin.messaging().sendEachForMulticast({
          tokens: body.fcmTokens,
          android: { notification: { color: '#000000' } },
          notification: {
            title: body.title,
            body: body.message,
            ...(body.imageUrl && { image: body.imageUrl }),
          },
        }),

        this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            notification: {
              create: {
                title: body.title,
                content: body.message,
                image: body.imageUrl,
              },
            },
          },
        }),
      ]);

      return new AppSuccess(noti, 'Notification sent successfully');
    } catch (error) {
      return { error: 'Failed to send notification' };
    }
  }

  async sendNotificationToAllUsers(body: {
    title: string;
    message: string;
    imageUrl?: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: { fcmToken: { not: null } },
      select: { fcmToken: true, id: true },
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found with FCM tokens');
    }

    const fcmTokens = users.map((user) => user.id);

    const message = {
      tokens: fcmTokens,
      android: { notification: { color: '#000000' } },
      notification: {
        title: body.title,
        body: body.message,
        ...(body.imageUrl && { image: body.imageUrl }),
      },
    };

    try {
      const message: admin.messaging.Message = {
        topic: 'packages',
        notification: { title: body.title, body: body.message },
      };
      console.log('hi');

      const [noti, ad] = await Promise.all([
        admin.messaging().send(message),
        fcmTokens.map(
          async (id) =>
            await this.prisma.user.update({
              where: { id },
              data: {
                notification: {
                  create: {
                    content: body.message,
                    title: body.title,
                    ...(body.imageUrl && { image: body.imageUrl }),
                  },
                },
              },
            }),
        ),
        // await this.prisma.notification.createMany({
        //   data: fcmTokens.map((token) => ({
        //     title: body.title,
        //     content: body.message,
        //     user: { connect: token },
        //   })),
        // }),
        // this.prisma.notification.create({
        //   data: {},
        // }),
      ]);
      console.log('Notification sent to all users:', ad);
      return new AppSuccess(
        noti,
        'Notification sent to all users successfully',
      );
    } catch (error) {
      console.log(error);

      return { error: 'Failed to send notification to all users' };
    }
  }
}
