import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsQueryService } from './services/settings-query.service';
import { SettingsManageService } from './services/settings-manage.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SettingsQueryService, SettingsManageService],
  exports: [SettingsService],
})
export class SettingsModule {}
