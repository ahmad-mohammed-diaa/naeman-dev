import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReviewOrderDto } from '../dto/review-order.dto';
import { calculateRedemption } from '@/common/utils/points.util';
import { hasConflict, parseSlotToMinutes } from '@/common/utils/slot.util';
import {
  AppBadRequestException,
  AppConflictException,
  AppNotFoundException,
} from '@/common/exceptions/app.exception';

interface PricingResult {
  subTotal: number;
  duration: number;
  serviceIds: string[];
}

interface PromoResult {
  discount: number;
  discountType: 'AMOUNT' | 'PERCENTAGE';
  promoCodeValue: string | undefined;
}

interface PointsResult {
  pointsUsed: number;
  pointsValue: number;
}

@Injectable()
export class OrderReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async review(userId: string, dto: ReviewOrderDto) {
    const isPackageOrder = !!dto.packageId;

    const { settings } = await this.loadBarberAndSettings(dto.barberId);
    this.validateBookingDate(dto.date, settings?.maxDaysBooking ?? 3);
    const existingOrders = await this.loadExistingOrders(
      dto.barberId,
      dto.date,
    );

    const { subTotal, duration, serviceIds } = isPackageOrder
      ? await this.calcPackagePricing(userId, dto.packageId!)
      : await this.calcServicePricing(dto.serviceIds);

    this.checkSlotConflict(dto.slot, duration, existingOrders);

    const { discount, discountType, promoCodeValue } = isPackageOrder
      ? {
          discount: 0,
          discountType: 'AMOUNT' as const,
          promoCodeValue: undefined,
        }
      : await this.applyPromoCode(dto.promoCode, subTotal);

    const afterDiscount = subTotal - discount;

    const { pointsUsed, pointsValue } =
      !isPackageOrder &&
      dto.pointsToRedeem &&
      dto.pointsToRedeem > 0 &&
      settings
        ? await this.applyPointsRedemption(
            userId,
            dto.pointsToRedeem,
            afterDiscount,
            {
              pointsPercentage: settings.pointsPercentage,
              pointLimit: settings.pointLimit,
              pointValue: 1,
            },
          )
        : { pointsUsed: 0, pointsValue: 0 };

    const total = afterDiscount - pointsValue;

    const reviewToken = this.signToken({
      userId,
      barberId: dto.barberId,
      branchId: dto.branchId,
      date: dto.date,
      slot: dto.slot,
      serviceIds,
      packageId: dto.packageId ?? null,
      pointsToRedeem: pointsUsed,
      promoCode: promoCodeValue ?? null,
      discountType,
      subTotal,
      discount,
      pointsValue,
      total,
      duration,
    });

    return {
      breakdown: { subTotal, discount, pointsValue, total, duration },
      reviewToken,
    };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private async loadBarberAndSettings(barberId: string) {
    const [settings, barber] = await Promise.all([
      this.prisma.settings.findFirst(),
      this.prisma.barber.findUnique({
        where: { id: barberId },
        include: { branch: true, slot: true },
      }),
    ]);
    if (!barber) throw new AppNotFoundException('NOT_FOUND_BARBER');
    return { barber, settings };
  }

  private validateBookingDate(dateStr: string, maxDays: number) {
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(
      (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0 || diffDays > maxDays)
      throw new AppBadRequestException('ORDER_BOOKING_DATE_INVALID');
  }

  private async loadExistingOrders(barberId: string, dateStr: string) {
    const bookingDate = new Date(dateStr);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.order.findMany({
      where: {
        barberId,
        date: { gte: startOfDay, lte: endOfDay },
        booking: { not: 'CANCELLED' },
      },
      select: { slot: true, duration: true },
    });
  }

  private async calcPackagePricing(
    userId: string,
    packageId: string,
  ): Promise<PricingResult> {
    const clientPackage = await this.prisma.clientPackages.findFirst({
      where: { clientId: userId, packageId, isActive: true },
      include: { packageService: { include: { service: true } } },
    });
    if (!clientPackage)
      throw new AppBadRequestException('ORDER_NO_ACTIVE_PACKAGE');

    const activeServices = clientPackage.packageService.filter(
      (ps) => ps.isActive && ps.quantity > 0,
    );
    if (activeServices.length === 0)
      throw new AppBadRequestException('ORDER_PACKAGE_NO_SESSIONS');

    return {
      subTotal: 0,
      duration: activeServices.reduce(
        (acc, ps) => acc + ps.service.duration,
        0,
      ),
      serviceIds: activeServices.map((ps) => ps.serviceId),
    };
  }

  private async calcServicePricing(
    serviceIds?: string[],
  ): Promise<PricingResult> {
    if (!serviceIds || serviceIds.length === 0)
      throw new AppBadRequestException('ORDER_SERVICE_IDS_REQUIRED');

    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds }, available: true },
    });
    if (services.length !== serviceIds.length)
      throw new AppBadRequestException('SERVICE_UNAVAILABLE');

    return {
      subTotal: services.reduce((acc, s) => acc + s.price, 0),
      duration: services.reduce((acc, s) => acc + s.duration, 0),
      serviceIds,
    };
  }

  private checkSlotConflict(
    slot: string,
    duration: number,
    existingOrders: { slot: string; duration: number | null }[],
  ) {
    const proposedStart = parseSlotToMinutes(slot);
    const conflict = hasConflict(
      proposedStart,
      duration,
      existingOrders.map((o) => ({ slot: o.slot, duration: o.duration ?? 30 })),
    );
    if (conflict) throw new AppConflictException('ORDER_SLOT_CONFLICT');
  }

  private async applyPromoCode(
    promoCode: string | undefined,
    subTotal: number,
  ): Promise<PromoResult> {
    if (!promoCode)
      return { discount: 0, discountType: 'AMOUNT', promoCodeValue: undefined };

    const promo = await this.prisma.promoCode.findFirst({
      where: { code: promoCode, active: true, expiredAt: { gt: new Date() } },
    });
    if (!promo) throw new AppBadRequestException('PROMO_INVALID');

    const discountType: 'AMOUNT' | 'PERCENTAGE' =
      promo.type === 'PERCENTAGE' ? 'PERCENTAGE' : 'AMOUNT';
    const discount =
      promo.type === 'PERCENTAGE'
        ? Math.floor((subTotal * promo.discount) / 100)
        : Math.min(promo.discount, subTotal);

    return { discount, discountType, promoCodeValue: promoCode };
  }

  private async applyPointsRedemption(
    userId: string,
    pointsToRedeem: number,
    afterDiscount: number,
    settings: {
      pointsPercentage: number;
      pointLimit: number;
      pointValue: number;
    },
  ): Promise<PointsResult> {
    const client = await this.prisma.client.findUnique({
      where: { id: userId },
    });
    if (!client) throw new AppNotFoundException('NOT_FOUND_CLIENT');

    const result = calculateRedemption(
      pointsToRedeem,
      client.points,
      afterDiscount,
      {
        pointsPercentage: settings.pointsPercentage,
        pointLimit: settings.pointLimit,
        pointValue: settings.pointValue,
      },
    );
    return { pointsUsed: result.pointsUsed, pointsValue: result.cashValue };
  }

  private signToken(payload: Record<string, unknown>): string {
    return this.jwt.sign(payload, { expiresIn: '5m' });
  }
}
