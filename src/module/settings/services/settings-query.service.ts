import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SettingsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.settings.findFirst();
    if (!settings) {
      settings = await this.prisma.settings.create({ data: {} });
    }
    return settings;
  }
}
