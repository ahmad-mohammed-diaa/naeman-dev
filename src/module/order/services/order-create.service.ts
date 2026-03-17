import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import {
  AppBadRequestException,
  AppNotFoundException,
} from '../../../common/exceptions/app.exception';

interface ReviewPayload {
  userId: string;
  barberId: string;
  branchId: string;
  date: string;
  slot: string;
  duration: number;
  subTotal: number;
  discount: number;
  total: number;
  pointsToRedeem: number;
  packageId?: string;
  promoCode?: string;
  discountType: 'AMOUNT' | 'PERCENTAGE';
  serviceIds: string[];
}

@Injectable()
export class OrderCreateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateOrderDto) {
    const payload = this.verifyAndDecodeToken(dto.reviewToken);
    const key = this.buildIdempotencyKey(dto.reviewToken);

    const duplicate = await this.checkIdempotency(key);
    if (duplicate) return duplicate;

    const effectiveBarberId = dto.barberId ?? payload.barberId;

    const order = await this.prisma.$transaction(async (tx: PrismaService) => {
      await tx.idempotencyKey.create({
        data: { key, expiredAt: new Date(Date.now() + 15 * 60 * 1000) },
      });

      if (payload.pointsToRedeem > 0) {
        await this.deductPoints(tx, payload.userId, payload.pointsToRedeem);
      }

      if (payload.packageId) {
        await this.decrementPackageSessions(
          tx,
          payload.userId,
          payload.packageId,
        );
      }

      const newOrder = await this.createOrderRecord(
        tx,
        payload,
        effectiveBarberId,
      );

      await tx.idempotencyKey.update({
        where: { key },
        data: { orderId: newOrder.id },
      });

      return newOrder;
    });

    return { orderId: order.id, message: 'Order created successfully' };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private verifyAndDecodeToken(reviewToken: string): ReviewPayload {
    try {
      return this.jwt.verify(reviewToken) as ReviewPayload;
    } catch {
      throw new AppBadRequestException('ORDER_INVALID_REVIEW_TOKEN');
    }
  }

  private buildIdempotencyKey(reviewToken: string): string {
    const algorithm = this.config.get<string>('HASH_ALGORITHM') ?? 'sha256';
    return crypto.createHash(algorithm).update(reviewToken).digest('hex');
  }

  private async checkIdempotency(
    key: string,
  ): Promise<{ orderId: string; message: string } | null> {
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { key },
    });
    if (existing?.orderId)
      return { orderId: existing.orderId, message: 'Duplicate request' };
    return null;
  }

  private async deductPoints(
    tx: PrismaService,
    userId: string,
    pointsToRedeem: number,
  ): Promise<void> {
    await tx.client.update({
      where: { id: userId },
      data: { points: { decrement: pointsToRedeem } },
    });
    await tx.pointTransaction.create({
      data: { clientId: userId, type: 'REDEEM', amount: pointsToRedeem },
    });
  }

  private async decrementPackageSessions(
    tx: PrismaService,
    userId: string,
    packageId: string,
  ): Promise<void> {
    const clientPackage = await tx.clientPackages.findFirst({
      where: { clientId: userId, packageId, isActive: true },
      include: { packageService: true },
    });
    if (!clientPackage) throw new AppNotFoundException('NOT_FOUND_PACKAGE');

    for (const ps of clientPackage.packageService) {
      if (ps.quantity <= 0) continue;
      await tx.packagesServices.update({
        where: { id: ps.id },
        data: {
          quantity: { decrement: 1 },
          isActive: ps.quantity - 1 > 0,
        },
      });
    }

    const remaining = clientPackage.packageService.filter(
      (ps) => ps.quantity > 1,
    ).length;
    if (remaining === 0) {
      await tx.clientPackages.update({
        where: { id: clientPackage.id },
        data: { isActive: false },
      });
    }
  }

  private async createOrderRecord(
    tx: PrismaService,
    payload: ReviewPayload,
    effectiveBarberId: string,
  ) {
    const {
      userId,
      branchId,
      date,
      slot,
      duration,
      subTotal,
      discount,
      total,
      pointsToRedeem,
      promoCode,
      discountType,
      packageId,
      serviceIds,
    } = payload;

    return tx.order.create({
      data: {
        userId,
        barberId: effectiveBarberId,
        branchId,
        date: new Date(date),
        slot,
        duration,
        subTotal,
        discount,
        total,
        points: pointsToRedeem,
        promoCode: promoCode ?? null,
        type: discountType,
        orderItems: {
          create: serviceIds.map((serviceId: string) => ({
            serviceId,
            price: 0,
            source: packageId ? 'PACKAGE' : 'SERVICE',
          })),
        },
      },
    });
  }
}
