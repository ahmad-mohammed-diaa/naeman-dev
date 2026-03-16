import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';
import { ProductQueryService } from './product-query.service';
import { deepMapWithTranslation, parseLang } from '@/common/helpers/translation.helper';
import { CloudinaryService } from '@/common/cloudinary/cloudinary.service';

@Injectable()
export class ProductManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productQuery: ProductQueryService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const lang = parseLang(I18nContext.current()?.lang);

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;
    if (file) {
      const result = await this.cloudinary.upload(file.buffer, 'products');
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    try {
      const raw = await this.prisma.product.create({
        data: {
          productImg: imageUrl ?? '',
          price: dto.price,
          translation: { create: dto.translations.map((t) => ({ name: t.name, language: t.language })) },
        },
        include: { translation: true },
      });
      return deepMapWithTranslation(raw, lang);
    } catch (err) {
      if (imagePublicId) await this.cloudinary.delete(imagePublicId);
      throw err;
    }
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    const lang = parseLang(I18nContext.current()?.lang);
    await this.productQuery.findOne(id);

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;
    if (file) {
      const result = await this.cloudinary.upload(file.buffer, 'products');
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const { translations, ...rest } = dto;

    try {
      const raw = await this.prisma.product.update({
        where: { id },
        data: {
          ...rest,
          ...(imageUrl !== undefined && { productImg: imageUrl }),
          ...(translations && {
            translation: {
              deleteMany: {},
              create: translations.map((t) => ({ name: t.name, language: t.language })),
            },
          }),
        },
        include: { translation: true },
      });
      return deepMapWithTranslation(raw, lang);
    } catch (err) {
      if (imagePublicId) await this.cloudinary.delete(imagePublicId);
      throw err;
    }
  }

  async remove(id: string) {
    await this.productQuery.findOne(id);
    await this.prisma.product.update({ where: { id }, data: { available: false } });
    return { message: 'Product disabled' };
  }
}
