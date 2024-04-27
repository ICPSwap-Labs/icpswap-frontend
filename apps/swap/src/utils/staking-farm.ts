import type { FarmInfo } from "@icpswap/types";

export enum POOL_STATE {
  LIVE = "Live",
  CLOSURE = "Closure",
  UNSTARTED = "Unstarted",
  FINISHED = "Finished",
  Unspecified = "Unspecified",
}

export function getFarmsState(pool: FarmInfo | undefined): POOL_STATE {
  if (!pool) return POOL_STATE.Unspecified;

  if (pool.status.toLowerCase() === POOL_STATE.CLOSURE.toLowerCase()) return POOL_STATE.CLOSURE;

  const now = BigInt(new Date().getTime());
  const end = pool.endTime * BigInt(1000);
  const start = pool.startTime * BigInt(1000);

  if (now < start) return POOL_STATE.UNSTARTED;
  if (now > end) return POOL_STATE.FINISHED;

  return POOL_STATE.LIVE;
}
