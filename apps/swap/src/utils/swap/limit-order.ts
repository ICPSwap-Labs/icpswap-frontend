import { Pool, Position, TICK_SPACINGS } from "@icpswap/swap-sdk";

export function getBackendLimitTick(priceTick: number, pool: Pool) {
  const tickLower = priceTick - TICK_SPACINGS[pool.fee];
  const tickUpper = priceTick + TICK_SPACINGS[pool.fee];

  if (tickUpper < pool.tickCurrent) {
    return tickLower;
  }

  return tickUpper;
}

export function getPriceTick(limitTick: number, pool: Pool) {
  const tickCurrent = pool.tickCurrent;

  if (limitTick < tickCurrent) {
    return limitTick + TICK_SPACINGS[pool.fee];
  }

  return limitTick - TICK_SPACINGS[pool.fee];
}

export function getPriceTickByPosition(position: Position) {
  return position.tickLower + TICK_SPACINGS[position.pool.fee];
}
