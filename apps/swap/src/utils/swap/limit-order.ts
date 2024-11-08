import { Pool, Position, Token, TICK_SPACINGS, priceToClosestTick, nearestUsableTick, Price } from "@icpswap/swap-sdk";

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

export function priceToClosestUseableTick(price: Price<Token, Token>, pool: Pool, sorted: boolean) {
  const __orderPriceTick = priceToClosestTick(price);

  let useableTick = nearestUsableTick(__orderPriceTick, pool.tickSpacing);

  if (Math.abs(Math.abs(useableTick) - Math.abs(pool.tickCurrent)) <= TICK_SPACINGS[pool.fee]) {
    if (sorted) {
      useableTick += TICK_SPACINGS[pool.fee];
    } else {
      useableTick -= TICK_SPACINGS[pool.fee];
    }
  }

  return useableTick;
}
