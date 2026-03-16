/**
 * Points earn and redeem calculation utilities.
 *
 * Rules:
 *  - Package orders: points = 0 always (paid in cash upfront).
 *  - Service orders: client may redeem points up to pointLimit and up to the order total.
 *  - Earn: floor(total * pointsPercentage / 100) points after order is COMPLETED.
 *  - Redeem: cashValue = pointsToRedeem * pointValue (Float, e.g. 0.01 SAR per point).
 */

export interface PointsSettings {
  pointsPercentage: number; // % of order total returned as points
  pointLimit: number;       // max points redeemable per order
  pointValue: number;       // SAR value of 1 point (e.g. 0.01)
}

/**
 * Calculate how many points a client earns after a completed service order.
 */
export function calculateEarnedPoints(
  orderTotal: number,
  pointsPercentage: number,
): number {
  return Math.floor((orderTotal * pointsPercentage) / 100);
}

/**
 * Calculate the cash value of points the client wants to redeem.
 * Clamps to pointLimit and to the remaining order total after discount.
 *
 * @returns { pointsUsed, cashValue } — actual points consumed and their cash equivalent
 */
export function calculateRedemption(
  pointsRequested: number,
  clientPoints: number,
  afterDiscount: number,
  settings: PointsSettings,
): { pointsUsed: number; cashValue: number } {
  // Can't use more points than the client has
  const affordable = Math.min(pointsRequested, clientPoints);
  // Can't exceed per-order limit
  const capped = Math.min(affordable, settings.pointLimit);
  // Cash value of the capped points
  const rawCashValue = capped * settings.pointValue;
  // Can't pay more than the order total with points
  const cashValue = Math.min(rawCashValue, afterDiscount);
  // Back-calculate the actual points used after cash cap
  const pointsUsed = Math.ceil(cashValue / settings.pointValue);

  return { pointsUsed, cashValue };
}

/**
 * Recalculate points after barber edits a service order (Decision 7).
 * If the new total is lower than the cash value already locked in, refund the excess.
 *
 * @returns { adjustedPointsUsed, refundPoints, newTotal }
 */
export function recalculateAfterEdit(
  newAfterDiscount: number,
  lockedPointsCashValue: number,
  lockedPointsUsed: number,
  pointValue: number,
): { adjustedPointsUsed: number; refundPoints: number; newTotal: number } {
  const adjustedCashValue = Math.min(lockedPointsCashValue, newAfterDiscount);
  const adjustedPointsUsed = Math.ceil(adjustedCashValue / pointValue);
  const refundPoints = lockedPointsUsed - adjustedPointsUsed;
  const newTotal = newAfterDiscount - adjustedCashValue;

  return { adjustedPointsUsed, refundPoints, newTotal };
}
