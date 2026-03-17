import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderCancelService } from './order-cancel.service';
import { PrismaService } from 'src/prisma/prisma.service';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeOrder(overrides: Partial<any> = {}): any {
  return {
    id: 'order-1',
    userId: 'user-1',
    barberId: 'barber-1',
    booking: 'UPCOMING',
    status: 'PENDING',
    points: 0,
    total: 200,
    orderItems: [],
    ...overrides,
  };
}

function makeUser(overrides: Partial<any> = {}): any {
  return {
    id: 'user-1',
    name: 'John Doe',
    email: 'Oq7mM@example.com',
    phone: '+1234567890',
    role: 'USER',
    points: 100,
    canceledOrders: 0,
    ...overrides,
  };
}
// ─── Mock PrismaService factory ───────────────────────────────────────────────

function makePrisma(order: any, settings: any = { pointsPercentage: 10 }) {
  const prisma: any = {
    order: {
      findUnique: jest.fn().mockResolvedValue(order),
      update: jest.fn().mockResolvedValue(order),
    },
    client: { update: jest.fn().mockResolvedValue({}) },
    pointTransaction: { create: jest.fn().mockResolvedValue({}) },
    packageServices: { updateMany: jest.fn().mockResolvedValue({}) },
    clientPackage: { update: jest.fn().mockResolvedValue({}) },
    settings: { findFirst: jest.fn().mockResolvedValue(settings) },
    $transaction: jest
      .fn()
      .mockImplementation((arg: any) =>
        typeof arg === 'function' ? arg(prisma) : Promise.all(arg),
      ),
  };
  return prisma;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderCancelService', () => {
  let service: OrderCancelService;
  let prisma: ReturnType<typeof makePrisma>;

  async function build(order: any, settings?: any) {
    prisma = makePrisma(order, settings);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCancelService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(OrderCancelService);
  }

  // ─── cancel ───────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('throws NotFoundException when order does not exist', async () => {
      await build(null);
      const user = await makeUser();
      await expect(service.cancel('order-1', user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when order is already cancelled', async () => {
      const user = await makeUser();

      await build(makeOrder({ booking: 'CANCELLED' }));
      await expect(service.cancel('order-1', user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('restores package sessions when a PACKAGE item is cancelled', async () => {
      const order = makeOrder({
        orderItems: [
          { source: 'PACKAGE', clientPackageId: 'cp-1', serviceId: 'svc-1' },
        ],
      });
      await build(order);
      const user = await makeUser();
      await service.cancel('order-1', user);

      expect(prisma.packageServices.updateMany).toHaveBeenCalledWith({
        where: { clientPackagesId: 'cp-1', serviceId: 'svc-1' },
        data: { quantity: { increment: 1 }, isActive: true },
      });
      expect(prisma.clientPackage.update).toHaveBeenCalledWith({
        where: { id: 'cp-1' },
        data: { isActive: true },
      });
    });

    it('refunds locked points when order has points > 0', async () => {
      await build(makeOrder({ points: 50, userId: 'user-1' }));
      const user = await makeUser();
      await service.cancel('order-1', user);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { points: { increment: 50 } },
      });
      expect(prisma.pointTransaction.create).toHaveBeenCalledWith({
        data: {
          clientId: 'user-1',
          orderId: 'order-1',
          type: 'EARN',
          amount: 50,
        },
      });
    });

    it('increments canceledOrders when CLIENT cancels', async () => {
      await build(makeOrder({ userId: 'user-1' }));
      const user = await makeUser();
      await service.cancel('order-1', user);

      expect(prisma.client.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { canceledOrders: { increment: 1 } },
        }),
      );
    });

    it('does NOT increment canceledOrders when BARBER cancels', async () => {
      await build(makeOrder({ userId: 'user-1' }));
      const user = await makeUser();
      await service.cancel('order-1', user);

      const calls: any[] = prisma.client.update.mock.calls;
      const canceledOrdersCall = calls.find(
        ([arg]: [any]) => arg.data?.canceledOrders !== undefined,
      );
      expect(canceledOrdersCall).toBeUndefined();
    });

    it('returns success message', async () => {
      await build(makeOrder());
      const user = await makeUser();
      const result = await service.cancel('order-1', user);
      expect(result).toEqual({ message: 'Order cancelled' });
    });
  });

  // ─── markInProgress ───────────────────────────────────────────────────────

  describe('markInProgress', () => {
    it('throws NotFoundException when order does not exist', async () => {
      await build(null);
      await expect(service.markInProgress('order-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when order is not PENDING', async () => {
      await build(makeOrder({ status: 'IN_PROGRESS' }));
      await expect(service.markInProgress('order-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('updates status to IN_PROGRESS and returns message', async () => {
      await build(makeOrder({ status: 'PENDING' }));
      const result = await service.markInProgress('order-1');
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: 'IN_PROGRESS' },
      });
      expect(result).toEqual({ message: 'Order marked as in-progress' });
    });
  });

  // ─── markComplete ─────────────────────────────────────────────────────────

  describe('markComplete', () => {
    it('throws NotFoundException when order does not exist', async () => {
      await build(null);
      await expect(service.markComplete('order-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when order is not IN_PROGRESS', async () => {
      await build(makeOrder({ status: 'PENDING', orderItems: [] }));
      await expect(service.markComplete('order-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('earns points for a SERVICE order on completion', async () => {
      const order = makeOrder({
        status: 'IN_PROGRESS',
        total: 200,
        userId: 'user-1',
        orderItems: [{ source: 'SERVICE' }],
      });
      await build(order, { pointsPercentage: 10 });
      const result = await service.markComplete('order-1');
      // 200 * 10% = 20 points
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Order completed', pointsEarned: 20 });
    });

    it('does NOT earn points for a PACKAGE order', async () => {
      const order = makeOrder({
        status: 'IN_PROGRESS',
        total: 300,
        userId: 'user-1',
        orderItems: [{ source: 'PACKAGE' }],
      });
      await build(order);
      const result = await service.markComplete('order-1');
      // $transaction (array form) should NOT be called for point earning
      const arrayTxCalls = (prisma.$transaction.mock.calls as any[][]).filter(
        ([arg]) => Array.isArray(arg),
      );
      expect(arrayTxCalls).toHaveLength(0);
      expect(result).toEqual({ message: 'Order completed' });
    });

    it('skips point earning when userId is absent (walk-in)', async () => {
      const order = makeOrder({
        status: 'IN_PROGRESS',
        total: 200,
        userId: null,
        orderItems: [{ source: 'SERVICE' }],
      });
      await build(order);
      const result = await service.markComplete('order-1');
      expect(result).toEqual({ message: 'Order completed' });
    });
  });

  // ─── markPaid ─────────────────────────────────────────────────────────────

  describe('markPaid', () => {
    it('throws NotFoundException when order does not exist', async () => {
      await build(null);
      await expect(service.markPaid('order-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when order is not COMPLETED', async () => {
      await build(makeOrder({ status: 'IN_PROGRESS' }));
      await expect(service.markPaid('order-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('updates status to PAID and returns message', async () => {
      await build(makeOrder({ status: 'COMPLETED' }));
      const result = await service.markPaid('order-1');
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: 'PAID' },
      });
      expect(result).toEqual({ message: 'Order marked as paid' });
    });
  });
});
