import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/create-category.dto';
import { CategoryQueryService, CATEGORY_SELECT } from './category-query.service';
import { deepMapWithTranslation, parseLang } from '../../../common/helpers/translation.helper';

@Injectable()
export class CategoryManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryQuery: CategoryQueryService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const lang = parseLang(I18nContext.current()?.lang);
    const raw = await this.prisma.category.create({
      data: {
        type: dto.type,
        translation: { create: dto.translations.map((t) => ({ name: t.name, language: t.language })) },
      },
      select: CATEGORY_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const lang = parseLang(I18nContext.current()?.lang);
    await this.categoryQuery.findOne(id);
    const raw = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.translations && {
          translation: {
            deleteMany: {},
            create: dto.translations.map((t) => ({ name: t.name, language: t.language })),
          },
        }),
      },
      select: CATEGORY_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async remove(id: string) {
    await this.categoryQuery.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}
