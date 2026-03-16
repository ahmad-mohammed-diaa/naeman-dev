import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SettingsQueryService } from './settings-query.service';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@Injectable()
export class SettingsManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: SettingsQueryService,
  ) {}

  async update(dto: UpdateSettingsDto) {
    const settings = await this.query.get();

    const data: any = { ...dto };

    // When slotDuration changes, record effectiveSlotDurationDate
    if (dto.slotDuration !== undefined) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      data.effectiveSlotDurationDate = tomorrow;
    }

    return this.prisma.settings.update({ where: { id: settings.id }, data });
  }
}
