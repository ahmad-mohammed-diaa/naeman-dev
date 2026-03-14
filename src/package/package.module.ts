import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [],
  controllers: [PackageController],
  providers: [PackageService, NotificationService],
})
export class PackageModule {}
