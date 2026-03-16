import {
  parseSlotToMinutes,
  minutesToSlot,
  hasConflict,
  generateAvailableSlots,
  ExistingOrder,
} from './slot.util';

// ─── parseSlotToMinutes ───────────────────────────────────────────────────────
describe('parseSlotToMinutes', () => {
  it('converts "09:00" to 540', () => {
    expect(parseSlotToMinutes('09:00')).toBe(540);
  });

  it('converts "13:30" to 810', () => {
    expect(parseSlotToMinutes('13:30')).toBe(810);
  });

  it('converts "00:00" to 0', () => {
    expect(parseSlotToMinutes('00:00')).toBe(0);
  });

  it('converts "23:59" to 1439', () => {
    expect(parseSlotToMinutes('23:59')).toBe(1439);
  });
});

// ─── minutesToSlot ────────────────────────────────────────────────────────────
describe('minutesToSlot', () => {
  it('converts 540 to "09:00"', () => {
    expect(minutesToSlot(540)).toBe('09:00');
  });

  it('converts 810 to "13:30"', () => {
    expect(minutesToSlot(810)).toBe('13:30');
  });

  it('converts 0 to "00:00"', () => {
    expect(minutesToSlot(0)).toBe('00:00');
  });

  it('converts 1439 to "23:59"', () => {
    expect(minutesToSlot(1439)).toBe('23:59');
  });
});

// ─── hasConflict ──────────────────────────────────────────────────────────────
describe('hasConflict', () => {
  const orders: ExistingOrder[] = [
    { slot: '10:00', duration: 60 }, // 600–660
  ];

  it('returns false when no existing orders', () => {
    expect(hasConflict(600, 30, [])).toBe(false);
  });

  it('returns false when proposed is before existing (adjacent)', () => {
    // proposed: 540–600, existing: 600–660 → adjacent, no overlap
    expect(hasConflict(540, 60, orders)).toBe(false);
  });

  it('returns false when proposed is after existing (adjacent)', () => {
    // proposed: 660–720, existing: 600–660 → adjacent, no overlap
    expect(hasConflict(660, 60, orders)).toBe(false);
  });

  it('returns true when proposed starts inside existing', () => {
    // proposed: 620–680, existing: 600–660 → overlap
    expect(hasConflict(620, 60, orders)).toBe(true);
  });

  it('returns true when proposed ends inside existing', () => {
    // proposed: 560–620, existing: 600–660 → overlap
    expect(hasConflict(560, 60, orders)).toBe(true);
  });

  it('returns true when proposed fully contains existing', () => {
    // proposed: 580–700, existing: 600–660 → overlap
    expect(hasConflict(580, 120, orders)).toBe(true);
  });

  it('returns true when proposed is fully inside existing', () => {
    // proposed: 610–640, existing: 600–660 → overlap
    expect(hasConflict(610, 30, orders)).toBe(true);
  });

  it('checks against multiple orders', () => {
    const multi: ExistingOrder[] = [
      { slot: '09:00', duration: 30 }, // 540–570
      { slot: '11:00', duration: 30 }, // 660–690
    ];
    // 570–600: free
    expect(hasConflict(570, 30, multi)).toBe(false);
    // 645–675: overlaps 11:00 order
    expect(hasConflict(645, 30, multi)).toBe(true);
  });
});

// ─── generateAvailableSlots ───────────────────────────────────────────────────
describe('generateAvailableSlots', () => {
  // Branch: 9:00–22:00, 30-min slots, 30-min service, no orders
  it('generates all slots within branch hours when no orders', () => {
    const slots = generateAvailableSlots(9, 22, 30, 30, []);
    expect(slots[0]).toBe('09:00');
    expect(slots[slots.length - 1]).toBe('21:30');
    // 9:00 to 21:30 inclusive = (22*60 - 9*60) / 30 = 26 slots
    expect(slots.length).toBe(26);
  });

  it('excludes conflicting slots', () => {
    const orders: ExistingOrder[] = [{ slot: '10:00', duration: 60 }];
    const slots = generateAvailableSlots(9, 22, 30, 30, orders);
    expect(slots).not.toContain('10:00');
    expect(slots).not.toContain('10:30');
    expect(slots).toContain('09:30');
    expect(slots).toContain('11:00');
  });

  it('excludes slots where service would overflow closing hour', () => {
    // Service duration 60 min, last slot must end by closingHour*60 (22:00 = 1320)
    // → last valid start = 21:00
    const slots = generateAvailableSlots(9, 22, 30, 60, []);
    expect(slots[slots.length - 1]).toBe('21:00');
    expect(slots).not.toContain('21:30');
  });

  it('respects barber shift override (narrower window)', () => {
    // Barber works 10:00–14:00 (plain hours: 10, 14), 30-min service
    const slots = generateAvailableSlots(9, 22, 30, 30, [], 10, 14);
    expect(slots[0]).toBe('10:00');
    expect(slots[slots.length - 1]).toBe('13:30');
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('14:00');
  });

  it('returns empty array when all slots are booked', () => {
    // 9:00–10:00 window, 60-min service, one 60-min order at 9:00
    const orders: ExistingOrder[] = [{ slot: '09:00', duration: 60 }];
    const slots = generateAvailableSlots(9, 10, 60, 60, orders);
    expect(slots).toHaveLength(0);
  });

  it('returns empty array when service duration exceeds full window', () => {
    // 1-hour window, 90-min service
    const slots = generateAvailableSlots(9, 10, 30, 90, []);
    expect(slots).toHaveLength(0);
  });

  it('handles back-to-back orders with a free slot between them', () => {
    const orders: ExistingOrder[] = [
      { slot: '09:00', duration: 30 }, // 9:00–9:30
      { slot: '10:00', duration: 30 }, // 10:00–10:30
    ];
    const slots = generateAvailableSlots(9, 11, 30, 30, orders);
    // 9:30 is free, 10:30 is free
    expect(slots).toContain('09:30');
    expect(slots).toContain('10:30');
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('10:00');
  });
});
