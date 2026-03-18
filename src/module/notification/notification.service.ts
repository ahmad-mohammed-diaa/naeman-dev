import { Injectable } from '@nestjs/common';
import { NotificationCreateService } from './services/notification-create.service';
import { NotificationQueryService } from './services/notification-query.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly createSvc: NotificationCreateService,
    private readonly query: NotificationQueryService,
  ) {}

  create(dto: CreateNotificationDto, file?: Express.Multer.File) {
    return this.createSvc.create(dto, file);
  }

  getUserNotifications(userId: string) {
    return this.query.getUserNotifications(userId);
  }

  setFcmToken(userId: string, fcmToken: string) {
    return this.query.setFcmToken(userId, fcmToken);
  }
}
