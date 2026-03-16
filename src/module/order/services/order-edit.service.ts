import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BarberUpdateOrderDto } from '../dto/update-order.dto';
import { recalculateAfterEdit } from '@/common/utils/points.util';

@Injectable()
export class OrderEditService {
  constructor(private readonly prisma: PrismaService) {}

  async barberUpdate(
    orderId: string,
    barberId: string,
    dto: BarberUpdateOrderDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.barberId !== barberId)
      throw new ForbiddenException('Not your order');
    if (order.orderItems.some((i) => i.source === 'PACKAGE'))
      throw new ForbiddenException('Package orders cannot be edited');
    if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
      throw new BadRequestException('Cannot edit a closed order');
    }

    const services = await this.prisma.service.findMany({
      where: { id: { in: dto.serviceIds }, available: true },
    });
    if (services.length !== dto.serviceIds.length)
      throw new BadRequestException('Invalid services');

    const settings = await this.prisma.settings.findFirst();
    const newSubTotal = services.reduce((acc, s) => acc + s.price, 0);
    const newDuration = services.reduce((acc, s) => acc + s.duration, 0);

    let newDiscount = 0;
    if (order.promoCode) {
      const promo = await this.prisma.promoCode.findFirst({
        where: { code: order.promoCode, active: true },
      });
      if (promo) {
        newDiscount =
          promo.type === 'PERCENTAGE'
            ? Math.floor((newSubTotal * promo.discount) / 100)
            : Math.min(promo.discount, newSubTotal);
      }
    }

    const newAfterDiscount = newSubTotal - newDiscount;
    const pointValue = 0.01;
    const lockedPointsCashValue = order.points * pointValue;

    const { adjustedPointsUsed, refundPoints, newTotal } = recalculateAfterEdit(
      newAfterDiscount,
      lockedPointsCashValue,
      order.points,
      pointValue,
    );

    await this.prisma.$transaction(async (tx: PrismaService) => {
      if (refundPoints > 0) {
        await tx.client.update({
          where: { id: order.userId! },
          data: { points: { increment: refundPoints } },
        });
        await tx.pointTransaction.create({
          data: {
            clientId: order.userId!,
            orderId,
            type: 'EARN',
            amount: refundPoints,
          },
        });
      }

      await tx.orderItem.deleteMany({ where: { orderId } });
      await tx.orderItem.createMany({
        data: services.map((s) => ({
          orderId,
          serviceId: s.id,
          price: s.price,
          source: 'SERVICE' as const,
        })),
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          subTotal: newSubTotal,
          discount: newDiscount,
          total: newTotal,
          duration: newDuration,
          points: adjustedPointsUsed,
        },
      });
    });

    return { message: 'Order updated', newTotal };
  }
}
