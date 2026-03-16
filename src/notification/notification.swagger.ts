import { ApiDoc } from 'src/common/decorators/api-doc.decorator';

export const NotificationSwagger = {
  setFCM: () =>
    ApiDoc({
      summary: 'Set FCM token for push notifications',
      auth: true,
    }),
  sendNotification: () =>
    ApiDoc({
      summary: 'Send a push notification to FCM tokens',
      auth: true,
    }),
  getNotification: () =>
    ApiDoc({
      summary: 'Get notification history for current user',
      auth: true,
    }),
};
