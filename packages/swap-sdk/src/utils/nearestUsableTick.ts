import invariant from "tiny-invariant";

import { TickMath } from "./tickMath";

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
export function nearestUsableTick(tick: number, tickSpacing: number) {
  invariant(Number.isInteger(tick) && Number.isInteger(tickSpacing), "INTEGERS");
  invariant(tickSpacing > 0, "TICK_SPACING");
  invariant(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK, "TICK_BOUND");
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;
  if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;
  return rounded;
}

export function availableTick(tick: number) {
  if (tick > TickMath.MAX_TICK) return TickMath.MAX_TICK;
  if (tick < TickMath.MIN_TICK) return TickMath.MIN_TICK;

  return tick;
}
