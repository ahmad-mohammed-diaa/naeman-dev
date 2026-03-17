import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppNotFoundException } from '../../../common/exceptions/app.exception';
import { deepMapWithTranslation, parseLang } from '../../../common/helpers/translation.helper';

@Injectable()
export class ProductQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const lang = parseLang(I18nContext.current()?.lang);
    const raw = await this.prisma.product.findMany({
      where: { available: true },
      include: { translation: true },
    });
    return deepMapWithTranslation(raw, lang);
  }

  async findOne(id: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { translation: true },
    });
    if (!product) throw new AppNotFoundException('NOT_FOUND_PRODUCT');
    return deepMapWithTranslation(product, lang);
  }
}
