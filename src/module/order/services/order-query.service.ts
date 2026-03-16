import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { AppNotFoundException } from '@/common/exceptions/app.exception';
import {
  deepMapWithTranslation,
  parseLang,
} from '@/common/helpers/translation.helper';
import {
  buildPagination,
  PaginationParams,
} from '@/common/helpers/pagination.helper';
import { Language } from 'generated/prisma/enums';
import { DateRangeDto } from '../dto/date-range.dto';

function buildDateFilter(from?: string, to?: string) {
  const filter: Record<string, Date> = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return Object.keys(filter).length ? filter : undefined;
}

// ─── Shared include ───────────────────────────────────────────────────────────
const ORDER_INCLUDE = {
  orderItems: { include: { service: { include: { translation: true } } } },
  barber: {
    select: { firstName: true, lastName: true, avatar: true, phone: true },
  },
  branch: { include: { translation: true } },
} as const;

type OrderWithIncludes = Prisma.OrderGetPayload<{
  include: typeof ORDER_INCLUDE;
}>;

@Injectable()
export class OrderQueryService {
  constructor(private readonly prisma: PrismaService) {}

  private shape(order: OrderWithIncludes, lang: Language) {
    const { orderItems, barber, branch, barberName, ...rest } = order;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const branchMapped = deepMapWithTranslation(branch, lang) as any;
    return {
      ...rest,
      branchName: branchMapped.name ?? branch.location,
      branchLocation: branch.location,
      branchPhone: branch.phone,
      barberName: barber
        ? `${barber.firstName} ${barber.lastName}`
        : barberName,
      barberPhone: barber?.phone ?? null,
      orderItems: orderItems.map(
        (item: { id: string; price: number; source: string; service: any }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const svc = deepMapWithTranslation(item.service, lang) as any;
          return {
            id: item.id,
            price: item.price,
            source: item.source,
            name: svc.name,
          };
        },
      ),
    };
  }

  async findOne(id: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new AppNotFoundException('NOT_FOUND_ORDER');
    return this.shape(order, lang);
  }

  async findAll(params: PaginationParams = {}, range: DateRangeDto = {}) {
    const lang = parseLang(I18nContext.current()?.lang);
    const { pagination, buildResult } = buildPagination(params);
    const dateFilter = buildDateFilter(range.from, range.to);
    const where = dateFilter ? { date: dateFilter } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        ...pagination,
        where,
        orderBy: { date: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where }),
    ]);
    return buildResult(
      data.map((o) => this.shape(o, lang)),
      total,
    );
  }

  async findUserOrders(userId: string) {
    const lang = parseLang(I18nContext.current()?.lang);
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: ORDER_INCLUDE,
    });
    return orders.map((o) => this.shape(o, lang));
  }
}
