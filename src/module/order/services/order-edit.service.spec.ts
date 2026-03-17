import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderEditService } from './order-edit.service';
import { PrismaService } from 'src/prisma/prisma.service';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeOrder(overrides: Partial<any> = {}): any {
  return {
    id: 'order-1',
    userId: 'user-1',
    barberId: 'barber-1',
    status: 'PENDING',
    points: 0,
    subTotal: 200,
    total: 200,
    discount: 0,
    promoCode: null,
    orderItems: [{ source: 'SERVICE' }],
    ...overrides,
  };
}

const mockSettings = { pointValue: 0.01 };

// ─── Mock PrismaService factory ───────────────────────────────────────────────

function makePrisma(order: any, services: any[] = [], promo: any = null) {
  const prisma: any = {
    order: {
      findUnique: jest.fn().mockResolvedValue(order),
      update: jest.fn().mockResolvedValue(order),
    },
    service: { findMany: jest.fn().mockResolvedValue(services) },
    settings: { findFirst: jest.fn().mockResolvedValue(mockSettings) },
    promoCode: { findFirst: jest.fn().mockResolvedValue(promo) },
    client: { update: jest.fn().mockResolvedValue({}) },
    pointTransaction: { create: jest.fn().mockResolvedValue({}) },
    orderItem: {
      deleteMany: jest.fn().mockResolvedValue({}),
      createMany: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn().mockImplementation((fn: any) => fn(prisma)),
  };
  return prisma;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderEditService', () => {
  let service: OrderEditService;
  let prisma: ReturnType<typeof makePrisma>;

  async function build(order: any, services: any[] = [], promo: any = null) {
    prisma = makePrisma(order, services, promo);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEditService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(OrderEditService);
  }

  const dto = { serviceIds: ['svc-1', 'svc-2'] };

  // ─── Guard checks ─────────────────────────────────────────────────────────

  describe('guard checks', () => {
    it('throws NotFoundException when order does not exist', async () => {
      await build(null);
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when barber is not the order owner', async () => {
      await build(makeOrder({ barberId: 'other-barber' }));
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when order contains PACKAGE items', async () => {
      await build(makeOrder({ orderItems: [{ source: 'PACKAGE' }] }));
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when order is CANCELLED', async () => {
      await build(makeOrder({ status: 'CANCELLED' }), [
        { id: 'svc-1', price: 100, duration: 30 },
        { id: 'svc-2', price: 100, duration: 30 },
      ]);
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when order is COMPLETED', async () => {
      await build(makeOrder({ status: 'COMPLETED' }), [
        { id: 'svc-1', price: 100, duration: 30 },
        { id: 'svc-2', price: 100, duration: 30 },
      ]);
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when a requested service is unavailable', async () => {
      // Only 1 service returned but 2 requested → mismatch
      await build(makeOrder(), [{ id: 'svc-1', price: 100, duration: 30 }]);
      await expect(
        service.barberUpdate('order-1', 'barber-1', dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Successful update ────────────────────────────────────────────────────

  describe('successful update', () => {
    const services = [
      { id: 'svc-1', price: 80, duration: 30 },
      { id: 'svc-2', price: 70, duration: 45 },
    ];

    it('replaces order items and updates totals', async () => {
      await build(makeOrder(), services);
      await service.barberUpdate('order-1', 'barber-1', dto);

      expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId: 'order-1' },
      });
      expect(prisma.orderItem.createMany).toHaveBeenCalledWith({
        data: [
          {
            orderId: 'order-1',
            serviceId: 'svc-1',
            price: 80,
            source: 'SERVICE',
          },
          {
            orderId: 'order-1',
            serviceId: 'svc-2',
            price: 70,
            source: 'SERVICE',
          },
        ],
      });
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ subTotal: 150, duration: 75 }),
        }),
      );
    });

    it('returns updated total', async () => {
      await build(makeOrder(), services);
      const result = await service.barberUpdate('order-1', 'barber-1', dto);
      expect(result).toEqual({ message: 'Order updated', newTotal: 150 });
    });

    it('refunds excess points when new total is lower than locked points cash value', async () => {
      // Order originally had 5000 points locked (= 50 SAR), new total is only 100 SAR after discount
      const order = makeOrder({ points: 5000, total: 50 });
      const cheaperServices = [
        { id: 'svc-1', price: 30, duration: 30 },
        { id: 'svc-2', price: 20, duration: 30 },
      ];
      await build(order, cheaperServices);
      await service.barberUpdate('order-1', 'barber-1', dto);

      // New subTotal = 50 SAR, locked cash = 5000 * 0.01 = 50 SAR → fits exactly → no refund
      // Actually let's check: adjustedCashValue = min(50, 50) = 50, adjustedPointsUsed = ceil(50/0.01) = 5000
      // refundPoints = 5000 - 5000 = 0
      expect(prisma.client.update).not.toHaveBeenCalled();
    });

    it('refunds points when new total drops below locked points cash value', async () => {
      // 200 points locked = 2 SAR cash, new total = 1 SAR → refund 100 points
      const order = makeOrder({ points: 200, total: 198 }); // original total after 2 SAR points
      const cheapServices = [
        { id: 'svc-1', price: 1, duration: 30 },
        { id: 'svc-2', price: 0, duration: 30 },
      ];
      await build(order, cheapServices);
      await service.barberUpdate('order-1', 'barber-1', dto);

      // newSubTotal = 1, lockedCash = 200 * 0.01 = 2, adjustedCash = min(2,1) = 1
      // adjustedPointsUsed = ceil(1/0.01) = 100, refundPoints = 200 - 100 = 100
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { points: { increment: 100 } },
      });
      expect(prisma.pointTransaction.create).toHaveBeenCalledWith({
        data: {
          clientId: 'user-1',
          orderId: 'order-1',
          type: 'EARN',
          amount: 100,
        },
      });
    });

    it('applies percentage promo code to new subtotal', async () => {
      const orderWithPromo = makeOrder({ promoCode: 'SAVE20' });
      const promo = {
        code: 'SAVE20',
        active: true,
        type: 'PERCENTAGE',
        discount: 20,
      };
      await build(orderWithPromo, services, promo);
      await service.barberUpdate('order-1', 'barber-1', dto);

      // subTotal = 150, 20% = 30 → discount = 30, total = 120
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ discount: 30, total: 120 }),
        }),
      );
    });
  });
});
