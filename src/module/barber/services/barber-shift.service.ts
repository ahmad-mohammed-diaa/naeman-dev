import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SetSlotDto } from '../dto/set-slot.dto';
import { DateRangeDto } from '../../order/dto/date-range.dto';
import { AppBadRequestException } from '../../../common/exceptions/app.exception';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDateFilter(from?: string, to?: string) {
  const filter: Record<string, Date> = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return Object.keys(filter).length ? filter : undefined;
}

@Injectable()
export class BarberShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async setSlot(barberId: string, dto: SetSlotDto) {
    const effectiveSlotDate = new Date();
    effectiveSlotDate.setDate(effectiveSlotDate.getDate() + 1); // effective from tomorrow

    await this.prisma.slot.upsert({
      where: { barberId },
      update: {
        start: dto.start,
        end: dto.end,
        effectiveSlotDate,
      },
      create: {
        barberId,
        start: dto.start,
        end: dto.end,
        slot: [],
        updatedSlot: [],
        effectiveSlotDate,
      },
    });

    return { message: 'Barber shift updated', effectiveSlotDate };
  }

  async getBarberOrders(barberId: string, range: DateRangeDto = {}) {
    // Barbers cannot query past dates
    if (range.from && new Date(range.from) < startOfToday()) {
      throw new AppBadRequestException('ORDER_DATE_PAST_NOT_ALLOWED');
    }

    const dateFilter = buildDateFilter(range.from, range.to);

    return this.prisma.order.findMany({
      where: {
        barberId,
        booking: 'UPCOMING',
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        ...(dateFilter && { date: dateFilter }),
      },
      orderBy: { date: 'asc' },
      include: { orderItems: { include: { service: true } } },
    });
  }
}
