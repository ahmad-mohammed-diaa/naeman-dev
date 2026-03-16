import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { SettingsSwagger } from './settings.swagger';

@Controller('v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @SettingsSwagger.get()
  @Get()
  get() {
    return this.settingsService.get();
  }

  @SettingsSwagger.update()
  @Patch()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:settings')
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}
