import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppNotFoundException } from '@/common/exceptions/app.exception';
import { deepMapWithTranslation, parseLang } from '@/common/helpers/translation.helper';

export const SERVICE_SELECT = {
  id: true,
  price: true,
  duration: true,
  serviceImg: true,
  available: true,
  categoryId: true,
  createdAt: true,
  translation: true,
};

@Injectable()
export class ServiceQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categoryId?: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const raw = await this.prisma.service.findMany({
      where: { available: true, ...(categoryId && { categoryId }) },
      select: SERVICE_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async findOne(id: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const service = await this.prisma.service.findUnique({ where: { id }, select: SERVICE_SELECT });
    if (!service) throw new AppNotFoundException('NOT_FOUND_SERVICE');
    return deepMapWithTranslation(service, lang);
  }
}
