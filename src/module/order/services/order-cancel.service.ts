import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CancelOrderDto } from '../dto/update-order.dto';
import { calculateEarnedPoints } from '@/common/utils/points.util';
import { User } from 'generated/prisma/client';

@Injectable()
export class OrderCancelService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Cancel (Decision 6) ────────────────────────────────────────────────────

  async cancel(orderId: string, CurrentUser: User) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.booking === 'CANCELLED')
      throw new BadRequestException('Order already cancelled');

    await this.prisma.$transaction(async (tx: PrismaService) => {
      for (const item of order.orderItems) {
        if (item.source === 'PACKAGE' && item.clientPackageId) {
          await tx.packagesServices.updateMany({
            where: {
              clientPackagesId: item.clientPackageId,
              serviceId: item.serviceId,
            },
            data: { quantity: { increment: 1 }, isActive: true },
          });
          await tx.clientPackages.update({
            where: { id: item.clientPackageId },
            data: { isActive: true },
          });
        }
      }

      if (order.points > 0 && order.userId) {
        await tx.client.update({
          where: { id: order.userId },
          data: { points: { increment: order.points } },
        });
        await tx.pointTransaction.create({
          data: {
            clientId: order.userId,
            orderId,
            type: 'EARN',
            amount: order.points,
          },
        });
      }

      if (
        (order.userId && CurrentUser.role === 'USER') ||
        CurrentUser.role === 'CLIENT'
      ) {
        await tx.client.update({
          where: { id: order.userId },
          data: { canceledOrders: { increment: 1 } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          booking: 'CANCELLED',
          status: 'CANCELLED',
          cancelledById: CurrentUser.id,
        },
      });
    });

    return { message: 'Order cancelled' };
  }

  // ─── Status transitions ──────────────────────────────────────────────────────

  async markInProgress(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDING')
      throw new BadRequestException(
        'Only PENDING orders can be marked in-progress',
      );
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'IN_PROGRESS' },
    });
    return { message: 'Order marked as in-progress' };
  }

  async markComplete(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'IN_PROGRESS')
      throw new BadRequestException(
        "You can't complete an order that didn't start yet",
      );

    const isPackageOrder = order.orderItems.some((i) => i.source === 'PACKAGE');
    if (!isPackageOrder && order.userId) {
      const settings = await this.prisma.settings.findFirst();
      const earned = calculateEarnedPoints(
        order.total,
        settings?.pointsPercentage ?? 10,
      );
      if (earned > 0) {
        await this.prisma.$transaction([
          this.prisma.client.update({
            where: { id: order.userId },
            data: { points: { increment: earned } },
          }),
          this.prisma.pointTransaction.create({
            data: {
              clientId: order.userId,
              orderId,
              type: 'EARN',
              amount: earned,
            },
          }),
          this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'COMPLETED' },
          }),
        ]);
        return { message: 'Order completed', pointsEarned: earned };
      }
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' },
    });
    return { message: 'Order completed' };
  }

  async markPaid(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'COMPLETED')
      throw new BadRequestException(
        'Only COMPLETED orders can be marked as paid',
      );
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
    return { message: 'Order marked as paid' };
  }
}
