import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateAvailableSlots } from '../../../common/utils/slot.util';

@Injectable()
export class SlotAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get available booking slots for a barber on a given date for a service.
   * Applies Decision 1: uses old shift for dates before effectiveSlotDate, new shift otherwise.
   */
  async getAvailableSlots(
    barberId: string,
    date: string,
    serviceIds: string[],
  ) {
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime()))
      throw new BadRequestException('Invalid date');

    const [barber, service, settings] = await Promise.all([
      this.prisma.barber.findUnique({
        where: { id: barberId },
        include: { branch: true, slot: true },
      }),
      this.prisma.service.findMany({ where: { id: { in: serviceIds } } }),
      this.prisma.settings.findFirst(),
    ]);

    if (!barber) throw new BadRequestException('Barber not found');
    if (!service) throw new BadRequestException('Service not found');

    const totalServiceDuration = service.reduce(
      (acc, s) => acc + (s.duration ?? 0),
      0,
    );
    if (totalServiceDuration === 0)
      throw new BadRequestException('Invalid service duration');

    // Check barber vacation
    const dayName = bookingDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toUpperCase();
    if (barber.daysOff.includes(dayName as any)) {
      return { slots: [], reason: 'Barber is on vacation' };
    }

    // Check max booking window
    const maxDays = settings?.maxDaysBooking ?? 3;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(
      (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0 || diffDays > maxDays) {
      throw new BadRequestException(
        `Can only book 0–${maxDays} days from today`,
      );
    }

    // Determine barber shift: Decision 1 grandfathering
    let barberStart: number | undefined;
    let barberEnd: number | undefined;
    if (barber.slot) {
      const effective = barber.slot.effectiveSlotDate;
      if (!effective || bookingDate >= effective) {
        barberStart = barber.slot.start;
        barberEnd = barber.slot.end;
      }
      // else: use branch hours (old shift grandfathered by not applying new slot)
    }

    // Slot duration — Decision 2: use current duration for new slots
    const slotDuration = settings?.slotDuration ?? 30;

    // Existing orders for this barber on this date (for conflict detection)
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingOrders = await this.prisma.order.findMany({
      where: {
        barberId,
        date: { gte: startOfDay, lte: endOfDay },
        booking: { not: 'CANCELLED' },
      },
      select: { slot: true, duration: true },
    });

    const slots = generateAvailableSlots(
      barber.branch.openingHour,
      barber.branch.closingHour,
      slotDuration,
      totalServiceDuration,
      existingOrders.map((o) => ({
        slot: o.slot,
        duration: o.duration ?? slotDuration,
      })),
      barberStart,
      barberEnd,
    );

    return { slots, date, barberId, totalServiceDuration, serviceIds };
  }
}
