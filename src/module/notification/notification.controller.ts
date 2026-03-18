import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SetFcmTokenDto } from './dto/set-fcm-token.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationSwagger } from './notification.swagger';
import { UploadFile } from '../../common/decorators/upload.decorator';
import { type User } from 'generated/prisma/client';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @NotificationSwagger.myNotifications()
  @Get('my')
  @Permissions('view:notifications')
  myNotifications(@CurrentUser() user: User) {
    return this.notificationService.getUserNotifications(user.id);
  }

  @NotificationSwagger.create()
  @UploadFile('image')
  @Post()
  @Permissions('create:notifications')
  create(
    @Body() dto: CreateNotificationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.notificationService.create(dto, file);
  }

  @NotificationSwagger.setFcmToken()
  @Patch('fcm-token')
  @Permissions('view:notifications')
  setFcmToken(@CurrentUser() user: User, @Body() dto: SetFcmTokenDto) {
    return this.notificationService.setFcmToken(user.id, dto.fcmToken);
  }
}
