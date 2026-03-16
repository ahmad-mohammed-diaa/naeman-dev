import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePromoCodeDto } from '../dto/create-promo-code.dto';
import { PromoQueryService } from './promo-query.service';

@Injectable()
export class PromoManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: PromoQueryService,
  ) {}

  create(dto: CreatePromoCodeDto) {
    return this.prisma.promoCode.create({
      data: { ...dto, expiredAt: new Date(dto.expiredAt) },
    });
  }

  async deactivate(id: string) {
    await this.query.findOne(id);
    return this.prisma.promoCode.update({ where: { id }, data: { active: false } });
  }
}
