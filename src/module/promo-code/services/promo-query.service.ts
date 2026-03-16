import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppNotFoundException } from '@/common/exceptions/app.exception';

@Injectable()
export class PromoQueryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const promo = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!promo) throw new AppNotFoundException('NOT_FOUND_PROMO');
    return promo;
  }

  async validate(code: string) {
    const promo = await this.prisma.promoCode.findFirst({
      where: { code, active: true, expiredAt: { gt: new Date() } },
    });
    if (!promo) throw new AppNotFoundException('PROMO_INVALID');
    return promo;
  }
}
