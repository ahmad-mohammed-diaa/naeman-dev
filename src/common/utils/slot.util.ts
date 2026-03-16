/**
 * Slot generation and conflict detection utilities.
 *
 * Decision 1: New barber shift applies only for bookingDate >= effectiveSlotDate.
 * Decision 2: Conflict detection uses time-range overlap math, not slot label matching.
 */

export interface ExistingOrder {
  slot: string; // e.g. "13:30"
  duration: number; // minutes
}

/**
 * Parse a "HH:MM" slot string to minutes from midnight.
 */
export function parseSlotToMinutes(slot: string): number {
  const [h, m] = slot.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Format minutes from midnight back to "HH:MM".
 */
export function minutesToSlot(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Check whether a proposed booking conflicts with an existing order.
 *
 * Uses time-range overlap: two intervals [a, b) and [c, d) overlap when a < d AND b > c.
 *
 * @param proposedStart   Minutes from midnight of the proposed slot
 * @param proposedDuration Duration of the proposed service in minutes
 * @param existingOrders  Existing orders for the same barber on the same day
 */
export function hasConflict(
  proposedStart: number,
  proposedDuration: number,
  existingOrders: ExistingOrder[],
): boolean {
  const proposedEnd = proposedStart + proposedDuration;

  for (const order of existingOrders) {
    const orderStart = parseSlotToMinutes(order.slot);
    const orderEnd = orderStart + order.duration;

    // Overlap condition: proposed starts before order ends AND proposed ends after order starts
    if (proposedStart < orderEnd && proposedEnd > orderStart) {
      return true;
    }
  }

  return false;
}

/**
 * Generate available time slots for a barber on a given date.
 *
 * @param openingHour     Branch opening hour (0–23), e.g. 9
 * @param closingHour     Branch closing hour (0–23), e.g. 22
 * @param slotDuration    Spacing between slots in minutes, e.g. 30
 * @param serviceDuration Duration of the service being booked in minutes
 * @param existingOrders  Orders already booked for this barber on this date
 * @param barberStart     Barber's shift start in minutes (from Slot.start), e.g. 540
 * @param barberEnd       Barber's shift end in minutes (from Slot.end), e.g. 900
 */
export function generateAvailableSlots(
  openingHour: number,
  closingHour: number,
  slotDuration: number,
  serviceDuration: number,
  existingOrders: ExistingOrder[],
  barberStart?: number,
  barberEnd?: number,
): string[] {
  // Window is the intersection of branch hours and barber shift
  const windowStart = (barberStart ?? openingHour) * 60;
  const windowEnd = (barberEnd ?? closingHour) * 60;

  const available: string[] = [];

  for (
    let t = windowStart;
    t + serviceDuration <= windowEnd;
    t += slotDuration
  ) {
    if (!hasConflict(t, serviceDuration, existingOrders)) {
      available.push(minutesToSlot(t));
    }
  }

  return available;
}
