import { Injectable } from '@nestjs/common';
import { SettingsQueryService } from './services/settings-query.service';
import { SettingsManageService } from './services/settings-manage.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly query: SettingsQueryService,
    private readonly manage: SettingsManageService,
  ) {}

  get() {
    return this.query.get();
  }

  update(dto: UpdateSettingsDto) {
    return this.manage.update(dto);
  }
}
