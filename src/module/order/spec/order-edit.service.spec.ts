import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderEditService } from '../services/order-edit.service';
import { PrismaService } from 'src/prisma/prisma.service';

// ─── Mock factory ─────────────────────────────────────────────────────────────

function makePrisma() {
  const prisma = {
    order: { findUnique: jest.fn(), update: jest.fn() },
    service: { findMany: jest.fn() },
    promoCode: { findFirst: jest.fn() },
    settings: { findFirst: jest.fn() },
    client: { update: jest.fn() },
    pointTransaction: { create: jest.fn() },
    orderItem: { deleteMany: jest.fn(), createMany: jest.fn() },
    $transaction: jest.fn().mockImplementation((arg: any) => {
      if (typeof arg === 'function') return arg(prisma);
      return Promise.all(arg);
    }),
  };
  return prisma;
}

function makeOrder(overrides: Record<string, any> = {}) {
  return {
    id: 'order-1',
    userId: 'client-1',
    barberId: 'barber-1',
    packageId: null,
    status: 'PENDING',
    promoCode: null,
    points: 0,
    total: 200,
    subTotal: 200,
    discount: 0,
    orderItems: [{ serviceId: 'svc-old', price: 200, source: 'SERVICE' }],
    ...overrides,
  };
}

const mockServices = [
  { id: 'svc-1', price: 150, duration: 30, available: true },
  { id: 'svc-2', price: 100, duration: 45, available: true },
];

async function build() {
  const prisma = makePrisma();
  const module: TestingModule = await Test.createTestingModule({
    providers: [OrderEditService, { provide: PrismaService, useValue: prisma }],
  }).compile();
  return { service: module.get(OrderEditService), prisma };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderEditService.barberUpdate', () => {
  describe('guard checks', () => {
    it('throws NotFoundException when order does not exist', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.barberUpdate('order-1', 'barber-1', { serviceIds: ['svc-1'] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when barber does not own the order', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ barberId: 'other-barber' }),
      );
      await expect(
        service.barberUpdate('order-1', 'barber-1', { serviceIds: ['svc-1'] }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException for package orders', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ orderItems: [{ source: 'PACKAGE' }] }),
      );
      await expect(
        service.barberUpdate('order-1', 'barber-1', { serviceIds: ['svc-1'] }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when order is CANCELLED', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ status: 'CANCELLED' }),
      );
      await expect(
        service.barberUpdate('order-1', 'barber-1', { serviceIds: ['svc-1'] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when order is COMPLETED', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ status: 'COMPLETED' }),
      );
      await expect(
        service.barberUpdate('order-1', 'barber-1', { serviceIds: ['svc-1'] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when a requested service is unavailable', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(makeOrder());
      // Only 1 service returned, but 2 were requested → mismatch
      prisma.service.findMany.mockResolvedValue([mockServices[0]]);
      prisma.settings.findFirst.mockResolvedValue({
        pointValue: 0.01,
        pointsPercentage: 10,
      });
      await expect(
        service.barberUpdate('order-1', 'barber-1', {
          serviceIds: ['svc-1', 'svc-2'],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('successful update', () => {
    it('updates order items and recalculates total (no points, no promo)', async () => {
      const { service, prisma } = await build();
      // order: subTotal=200, points=0, no promo
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ total: 200, subTotal: 200 }),
      );
      // new services: price = 150+100 = 250
      prisma.service.findMany.mockResolvedValue(mockServices);
      prisma.settings.findFirst.mockResolvedValue({ pointValue: 0.01 });
      const result = await service.barberUpdate('order-1', 'barber-1', {
        serviceIds: ['svc-1', 'svc-2'],
      });
      expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId: 'order-1' },
      });
      expect(prisma.orderItem.createMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.any(Array) }),
      );
      expect(result.newTotal).toBe(250); // no promo, no points
    });

    it('applies percentage promo code when present', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ promoCode: 'SAVE10' }),
      );
      prisma.service.findMany.mockResolvedValue(mockServices); // 250 total
      prisma.promoCode.findFirst.mockResolvedValue({
        code: 'SAVE10',
        type: 'PERCENTAGE',
        discount: 10,
        active: true,
      });
      prisma.settings.findFirst.mockResolvedValue({ pointValue: 0.01 });
      const result = await service.barberUpdate('order-1', 'barber-1', {
        serviceIds: ['svc-1', 'svc-2'],
      });
      // 10% of 250 = 25 discount → total = 225
      expect(result.newTotal).toBe(225);
    });

    it('applies flat-amount promo code when present', async () => {
      const { service, prisma } = await build();
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ promoCode: 'OFF50' }),
      );
      prisma.service.findMany.mockResolvedValue(mockServices); // 250
      prisma.promoCode.findFirst.mockResolvedValue({
        code: 'OFF50',
        type: 'AMOUNT',
        discount: 50,
        active: true,
      });
      prisma.settings.findFirst.mockResolvedValue({ pointValue: 0.01 });
      const result = await service.barberUpdate('order-1', 'barber-1', {
        serviceIds: ['svc-1', 'svc-2'],
      });
      // 250 - 50 = 200
      expect(result.newTotal).toBe(200);
    });

    it('refunds excess points when new total is lower', async () => {
      const { service, prisma } = await build();
      // original: 200 total, used 50 points (= 0.50 SAR)
      // new services: 100 → after promo: 100 → points cash = 0.50, fits → total = 99.50 → floor? let's check
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ total: 200, subTotal: 200, points: 50 }),
      );
      prisma.service.findMany.mockResolvedValue([
        { id: 'svc-1', price: 100, duration: 30 },
      ]);
      prisma.settings.findFirst.mockResolvedValue({ pointValue: 0.01 });
      await service.barberUpdate('order-1', 'barber-1', {
        serviceIds: ['svc-1'],
      });
      // new afterDiscount = 100, lockedPointsCashValue = 50 * 0.01 = 0.50
      // newTotal = 100 - 0.50 = 99.50 — points still fit, no refund
      expect(prisma.client.update).not.toHaveBeenCalled();
    });

    it('refunds points that no longer fit after edit reduces order below locked value', async () => {
      const { service, prisma } = await build();
      // original order: points=10000 (= 100 SAR cash), total used 100 SAR points
      // new services: 10 SAR → points cash (100) > new total (10) → refund excess
      prisma.order.findUnique.mockResolvedValue(
        makeOrder({ total: 200, subTotal: 200, points: 10000 }),
      );
      prisma.service.findMany.mockResolvedValue([
        { id: 'svc-1', price: 10, duration: 20 },
      ]);
      prisma.settings.findFirst.mockResolvedValue({ pointValue: 0.01 });
      await service.barberUpdate('order-1', 'barber-1', {
        serviceIds: ['svc-1'],
      });
      // points cash = 10000 * 0.01 = 100, new afterDiscount = 10
      // max usable cash = 10 → adjustedPoints = 10/0.01 = 1000 → refund = 10000-1000 = 9000
      expect(prisma.client.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ points: { increment: 9000 } }),
        }),
      );
      expect(prisma.pointTransaction.create).toHaveBeenCalled();
    });
  });
});
