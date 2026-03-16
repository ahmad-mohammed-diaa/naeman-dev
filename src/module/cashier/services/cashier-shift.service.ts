import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SetSlotDto } from '../../barber/dto/set-slot.dto';
import { DateRangeDto } from '../../order/dto/date-range.dto';

function buildDateFilter(from?: string, to?: string) {
  const filter: Record<string, Date> = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return Object.keys(filter).length ? filter : undefined;
}

@Injectable()
export class CashierShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async setSlot(cashierId: string, dto: SetSlotDto) {
    const effectiveSlotDate = new Date();
    effectiveSlotDate.setDate(effectiveSlotDate.getDate() + 1);

    await this.prisma.slot.upsert({
      where: { cashierId },
      update: { start: dto.start, end: dto.end, effectiveSlotDate },
      create: {
        cashierId,
        start: dto.start,
        end: dto.end,
        slot: [],
        updatedSlot: [],
        effectiveSlotDate,
      },
    });

    return { message: 'Cashier shift updated', effectiveSlotDate };
  }

  async getCashierOrders(cashierId: string, range: DateRangeDto = {}) {
    const dateFilter = buildDateFilter(range.from, range.to);
    return this.prisma.order.findMany({
      where: {
        cashierId,
        ...(dateFilter && { date: dateFilter }),
      },
      orderBy: { date: 'desc' },
      include: { orderItems: { include: { service: true } } },
    });
  }
}
