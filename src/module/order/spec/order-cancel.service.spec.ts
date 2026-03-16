import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderCancelService } from '../services/order-cancel.service';
import { PrismaService } from '@/prisma/prisma.service';

// ─── Mock factory ─────────────────────────────────────────────────────────────

function makePrisma() {
  const prisma = {
    order: { findUnique: jest.fn(), update: jest.fn() },
    client: { update: jest.fn() },
    pointTransaction: { create: jest.fn() },
    settings: { findFirst: jest.fn() },
    packageServices: { updateMany: jest.fn() },
    clientPackage: { update: jest.fn() },
    // callback form → execute fn with prisma as tx
    // array form → resolve all
    $transaction: jest.fn().mockImplementation((arg: any) => {
      if (typeof arg === 'function') return arg(prisma);
      return Promise.all(arg);
    }),
  };
  return prisma;
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
function makeOrder(overrides: Record<string, any> = {}) {
  return {
    id: 'order-1',
    userId: 'client-1',
    barberId: 'barber-1',
    packageId: null,
    booking: 'UPCOMING',
    status: 'PENDING',
    points: 0,
    total: 200,
    orderItems: [],
    ...overrides,
  };
}

// ─── Build helper ─────────────────────────────────────────────────────────────

async function build(prismaOverrides?: Partial<ReturnType<typeof makePrisma>>) {
  const prismaMock = { ...makePrisma(), ...prismaOverrides };
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OrderCancelService,
      { provide: PrismaService, useValue: prismaMock },
    ],
  }).compile();
  return { service: module.get(OrderCancelService), prisma: prismaMock };
}

// ─── cancel ───────────────────────────────────────────────────────────────────

describe('OrderCancelService.cancel', () => {
  it('throws NotFoundException when order not found', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(null);

    const user = await makeUser();
    await expect(service.cancel('order-1', user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when order already cancelled', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ booking: 'CANCELLED' }),
    );
    const user = await makeUser();
    await expect(service.cancel('order-1', user)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('cancels a plain service order (no points, no package)', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    const user = await makeUser();
    const result = await service.cancel('order-1', user);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { booking: 'CANCELLED', status: 'CANCELLED', canceledBy: 'BARBER' },
    });
    expect(result).toEqual({ message: 'Order cancelled' });
  });

  it('refunds redeemed points when order has points > 0', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder({ points: 100 }));
    const user = await makeUser();
    await service.cancel('order-1', user);
    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: 'client-1' },
      data: { points: { increment: 100 } },
    });
    expect(prisma.pointTransaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'EARN', amount: 100 }),
      }),
    );
  });

  it('increments canceledOrders when cancelled by CLIENT', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    const user = await makeUser();
    await service.cancel('order-1', user);
    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: 'client-1' },
      data: { canceledOrders: { increment: 1 } },
    });
  });

  it('does NOT increment canceledOrders when cancelled by BARBER', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    const user = await makeUser();
    await service.cancel('order-1', user);
    const canceledOrdersCall = (
      prisma.client.update as jest.Mock
    ).mock.calls.find((c) => c[0]?.data?.canceledOrders);
    expect(canceledOrdersCall).toBeUndefined();
  });

  it('restores package sessions when order has PACKAGE items', async () => {
    const { service, prisma } = await build();
    const packageItem = {
      source: 'PACKAGE',
      clientPackageId: 'cp-1',
      serviceId: 'svc-1',
    };
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ orderItems: [packageItem] }),
    );
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
});

// ─── markInProgress ───────────────────────────────────────────────────────────

describe('OrderCancelService.markInProgress', () => {
  it('throws NotFoundException when order not found', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.markInProgress('order-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when status is not PENDING', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ status: 'IN_PROGRESS' }),
    );
    await expect(service.markInProgress('order-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updates status to IN_PROGRESS for a PENDING order', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder({ status: 'PENDING' }));
    const result = await service.markInProgress('order-1');
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'IN_PROGRESS' },
    });
    expect(result.message).toMatch(/in-progress/i);
  });
});

// ─── markComplete ─────────────────────────────────────────────────────────────

describe('OrderCancelService.markComplete', () => {
  it('throws NotFoundException when order not found', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.markComplete('order-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when status is not IN_PROGRESS', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(makeOrder({ status: 'PENDING' }));
    await expect(service.markComplete('order-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('completes order and earns points for a service order', async () => {
    const { service, prisma } = await build();
    // total = 200, pointsPercentage = 10 → earned = 20
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({
        status: 'IN_PROGRESS',
        total: 200,
        packageId: null,
        userId: 'client-1',
      }),
    );
    prisma.settings.findFirst.mockResolvedValue({ pointsPercentage: 10 });
    const result = await service.markComplete('order-1');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toMatchObject({
      message: 'Order completed',
      pointsEarned: 20,
    });
  });

  it('completes order without earning points for a package order', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({
        status: 'IN_PROGRESS',
        total: 200,
        orderItems: [{ source: 'PACKAGE' }],
      }),
    );
    const result = await service.markComplete('order-1');
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'COMPLETED' },
    });
    expect(result).toEqual({ message: 'Order completed' });
  });

  it('completes order without points transaction when earned is 0', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ status: 'IN_PROGRESS', total: 0, packageId: null }),
    );
    prisma.settings.findFirst.mockResolvedValue({ pointsPercentage: 10 });
    await service.markComplete('order-1');
    // earned = 0 → no $transaction, just plain update
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'COMPLETED' },
    });
  });
});

// ─── markPaid ────────────────────────────────────────────────────────────────

describe('OrderCancelService.markPaid', () => {
  it('throws NotFoundException when order not found', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.markPaid('order-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when status is not COMPLETED', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ status: 'IN_PROGRESS' }),
    );
    await expect(service.markPaid('order-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updates status to PAID for a COMPLETED order', async () => {
    const { service, prisma } = await build();
    prisma.order.findUnique.mockResolvedValue(
      makeOrder({ status: 'COMPLETED' }),
    );
    const result = await service.markPaid('order-1');
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'PAID' },
    });
    expect(result.message).toMatch(/paid/i);
  });
});
