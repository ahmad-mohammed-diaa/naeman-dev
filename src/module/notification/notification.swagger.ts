import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { NotificationResponseDto } from './dto/responses/notification-response.dto';

export const NotificationSwagger = {
  myNotifications: () =>
    ApiDoc({
      summary: 'Get my notifications',
      auth: true,
      res: { ok: NotificationResponseDto, okIsArray: true },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create / broadcast notification',
      auth: true,
      consumes: ['application/json', 'multipart/form-data'],
      bodySchema: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Optional notification image',
          },
          userIds: {
            type: 'string',
            description:
              'JSON array string: ["userId1","userId2"]. Omit to broadcast to all.',
          },
        },
      },
      res: { ok: NotificationResponseDto },
    }),
};
