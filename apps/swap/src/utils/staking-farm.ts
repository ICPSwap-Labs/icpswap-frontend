import type { StakingFarmInfo } from "@icpswap/types";

export enum POOL_STATE {
  LIVE = "Live",
  CLOSURE = "Closure",
  UNSTARTED = "Unstarted",
  FINISHED = "Finished",
}

export function getFarmsState(pool: StakingFarmInfo): POOL_STATE {
  if (pool.status.toLowerCase() === POOL_STATE.CLOSURE.toLowerCase()) return POOL_STATE.CLOSURE;

  const now = BigInt(new Date().getTime());
  const end = pool.endTime * BigInt(1000);
  const start = pool.startTime * BigInt(1000);

  if (now < start) return POOL_STATE.UNSTARTED;
  if (now > end) return POOL_STATE.FINISHED;

  return POOL_STATE.LIVE;
}
