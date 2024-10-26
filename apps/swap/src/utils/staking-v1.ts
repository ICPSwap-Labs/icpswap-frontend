import { STATE } from "types/staking-token";
import type { StakingPoolControllerPoolInfo } from "types/staking-token-v1/index";

export enum POOL_STATE {
  LIVE = "Live",
  CLOSURE = "Closure",
  UNSTARTED = "Unstarted",
  FINISHED = "Finished",
}

export function getStakingTokenPoolState(pool: StakingPoolControllerPoolInfo | undefined | null): STATE {
  if (!pool) return STATE.LIVE;

  const now = BigInt(new Date().getTime());
  const end = pool.bonusEndTime * BigInt(1000);
  const start = pool.startTime * BigInt(1000);

  if (now < start) return STATE.UPCOMING;
  if (now > end) return STATE.FINISHED;

  return STATE.LIVE;
}
