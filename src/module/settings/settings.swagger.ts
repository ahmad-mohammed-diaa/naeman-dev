import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsResponseDto } from './dto/responses/settings-response.dto';

export const SettingsSwagger = {
  get: () =>
    ApiDoc({ summary: 'Get app settings', res: { ok: SettingsResponseDto } }),
  update: () =>
    ApiDoc({
      summary: 'Update app settings',
      auth: true,
      body: UpdateSettingsDto,
      res: { ok: SettingsResponseDto },
    }),
};
