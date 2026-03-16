import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppNotFoundException } from '@/common/exceptions/app.exception';
import { deepMapWithTranslation, parseLang } from '@/common/helpers/translation.helper';

export const CATEGORY_SELECT = {
  id: true,
  available: true,
  type: true,
  createdAt: true,
  translation: true,
};

@Injectable()
export class CategoryQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const lang = parseLang(I18nContext.current()?.lang);
    const raw = await this.prisma.category.findMany({
      where: { available: true },
      select: CATEGORY_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async findOne(id: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const cat = await this.prisma.category.findUnique({ where: { id }, select: CATEGORY_SELECT });
    if (!cat) throw new AppNotFoundException('NOT_FOUND_CATEGORY');
    return deepMapWithTranslation(cat, lang);
  }
}
