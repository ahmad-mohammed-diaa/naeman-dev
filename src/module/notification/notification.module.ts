import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationCreateService } from './services/notification-create.service';
import { NotificationQueryService } from './services/notification-query.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationCreateService, NotificationQueryService],
})
export class NotificationModule {}
