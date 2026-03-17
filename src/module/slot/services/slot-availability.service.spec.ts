import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SlotAvailabilityService } from './slot-availability.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from 'generated/prisma/browser';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a date string N days from today (YYYY-MM-DD) */
function DateStr(days: number, state: 'prev' | 'future'): string {
  const d = new Date();
  d.setDate(d.getDate() + (state === 'future' ? days : -days));
  return d.toISOString().split('T')[0];
}

const YESTERDAY = DateStr(1, 'prev');
const TOMORROW = DateStr(1, 'future');
const NEXT_WEEK = DateStr(7, 'future');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockBranch = { openingHour: 9, closingHour: 22 };
const mockSettings = { slotDuration: 30, maxDaysBooking: 3 };
const mockService = [
  { id: 'svc-1', duration: 30 },
  { id: 'svc-2', duration: 60 },
];

function makeBarber(overrides: Partial<any> = {}): any {
  return {
    id: 'barber-1',
    vacations: [],
    branch: mockBranch,
    slot: null,
    ...overrides,
  };
}

// ─── Mock PrismaService factory ───────────────────────────────────────────────

function makePrisma(
  barber: any,
  services = mockService,
  orders = [] as Order[],
) {
  return {
    barber: { findUnique: jest.fn().mockResolvedValue(barber) },
    service: { findMany: jest.fn().mockResolvedValue(services) },
    settings: { findFirst: jest.fn().mockResolvedValue(mockSettings) },
    order: { findMany: jest.fn().mockResolvedValue(orders) },
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SlotAvailabilityService', () => {
  let service: SlotAvailabilityService;
  let prisma: ReturnType<typeof makePrisma>;

  async function build(
    barber: any,
    services = mockService,
    orders = [] as Order[],
  ) {
    prisma = makePrisma(barber, services, orders);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotAvailabilityService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(SlotAvailabilityService);
  }

  describe('input validation', () => {
    beforeEach(() => build(makeBarber()));

    it('throws BadRequestException for an invalid date string', async () => {
      await expect(
        service.getAvailableSlots('barber-1', 'not-a-date', ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('barber not found', () => {
    it('throws BadRequestException when barber does not exist', async () => {
      await build(null);
      await expect(
        service.getAvailableSlots('barber-1', TOMORROW, ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('service validation', () => {
    it('throws BadRequestException when total service duration is 0', async () => {
      await build(makeBarber(), [{ id: 'svc-1', duration: 0 }]);
      await expect(
        service.getAvailableSlots('barber-1', TOMORROW, ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when service not found', async () => {
      await build(makeBarber(), []);
      await expect(
        service.getAvailableSlots('barber-1', TOMORROW, ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('booking window', () => {
    it('throws when date is in the past', async () => {
      await build(makeBarber());
      await expect(
        service.getAvailableSlots('barber-1', '2020-01-01', ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when date exceeds maxDaysBooking window', async () => {
      await build(makeBarber());
      const tooFar = DateStr(10, 'future'); // maxDaysBooking = 3
      await expect(
        service.getAvailableSlots('barber-1', tooFar, ['svc-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('barber on vacation', () => {
    it('returns empty slots with a reason message when barber is on vacation', async () => {
      // Pick the day-of-week name for TOMORROW
      const tomorrowDate = new Date(TOMORROW + 'T00:00:00');
      const dayName = tomorrowDate
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase();

      await build(makeBarber({ vacations: [dayName] }));
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.slots).toHaveLength(0);
      expect(result.reason).toMatch(/vacation/i);
    });
  });

  describe('slot generation', () => {
    it('returns available slots for a free day', async () => {
      await build(makeBarber());
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.slots[0]).toBe('09:00');
    });

    it('excludes slots blocked by existing orders', async () => {
      const bookedOrder = { slot: '10:00', duration: 30 } as Order;
      await build(makeBarber(), mockService, [bookedOrder]);
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.slots).not.toContain('10:00');
      expect(result.slots).toContain('10:30');
    });

    it('uses barber shift when effectiveSlotDate <= bookingDate', async () => {
      const barberWithShift = makeBarber({
        slot: {
          start: 10, // 10:00 (plain hour)
          end: 14, // 14:00 (plain hour)
          effectiveSlotDate: new Date(YESTERDAY), // already effective (must be Date for >= comparison)
        },
      });
      await build(barberWithShift);
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.slots[0]).toBe('10:00');
      expect(result.slots).not.toContain('09:00');
      expect(result.slots).not.toContain('14:00');
    });

    it('falls back to branch hours when effectiveSlotDate is in the future (grandfathering)', async () => {
      const barberWithFutureShift = makeBarber({
        slot: {
          start: 10, // 10:00 (plain hour) — should NOT apply yet
          end: 14, // 14:00 (plain hour)
          effectiveSlotDate: new Date(NEXT_WEEK),
        },
      });
      await build(barberWithFutureShift);
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      // Branch opens at 9, so first slot is 09:00
      expect(result.slots[0]).toBe('09:00');
    });

    it('returns correct metadata in response', async () => {
      await build(makeBarber());
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.barberId).toBe('barber-1');
      expect(result.date).toBe(TOMORROW);
      expect(result.totalServiceDuration).toBe(90);
      expect(result.serviceIds).toEqual(['svc-1', 'svc-2']);
    });

    it('sums duration across multiple services', async () => {
      const twoServices = [
        { id: 'svc-1', duration: 30 },
        { id: 'svc-2', duration: 60 },
      ];
      await build(makeBarber(), twoServices);
      const result = await service.getAvailableSlots('barber-1', TOMORROW, [
        'svc-1',
        'svc-2',
      ]);
      expect(result.totalServiceDuration).toBe(90);
      // Last slot must end by 22:00 (1320 min), so last start = 1320-90 = 1230 = 20:30
      expect(result.slots[result.slots.length - 1]).toBe('20:30');
    });
  });
});
