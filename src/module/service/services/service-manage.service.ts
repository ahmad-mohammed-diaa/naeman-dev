import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from '../dto/create-service.dto';
import { ServiceQueryService, SERVICE_SELECT } from './service-query.service';
import { deepMapWithTranslation, parseLang } from '@/common/helpers/translation.helper';

@Injectable()
export class ServiceManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceQuery: ServiceQueryService,
  ) {}

  async create(dto: CreateServiceDto) {
    const lang = parseLang(I18nContext.current()?.lang);
    const raw = await this.prisma.service.create({
      data: {
        price: dto.price,
        duration: dto.duration,
        categoryId: dto.categoryId,
        serviceImg: dto.serviceImg,
        translation: {
          create: dto.translations.map((t) => ({ name: t.name, language: t.language })),
        },
      },
      select: SERVICE_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const lang = parseLang(I18nContext.current()?.lang);
    await this.serviceQuery.findOne(id);
    const { translations, ...rest } = dto;
    const raw = await this.prisma.service.update({
      where: { id },
      data: {
        ...rest,
        ...(translations && {
          translation: {
            deleteMany: {},
            create: translations.map((t) => ({ name: t.name, language: t.language })),
          },
        }),
      },
      select: SERVICE_SELECT,
    });
    return deepMapWithTranslation(raw, lang);
  }

  async remove(id: string) {
    await this.serviceQuery.findOne(id);
    await this.prisma.service.update({ where: { id }, data: { available: false } });
    return { message: 'Service disabled' };
  }
}
