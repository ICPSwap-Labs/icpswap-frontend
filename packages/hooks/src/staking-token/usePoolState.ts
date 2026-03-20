import { type Null, type StakingPoolControllerPoolInfo, type StakingPoolInfo, StakingState } from "@icpswap/types";
import { nowInSeconds } from "@icpswap/utils";

export function getStakingPoolState(poolInfo: StakingPoolControllerPoolInfo | StakingPoolInfo): StakingState {
  const now = nowInSeconds();

  if (poolInfo.startTime > BigInt(now)) return StakingState.NOT_STARTED;
  if (poolInfo.bonusEndTime <= BigInt(now)) return StakingState.FINISHED;

  return StakingState.LIVE;
}

export function useStakingPoolState(
  poolInfo: StakingPoolControllerPoolInfo | StakingPoolInfo | Null,
): StakingState | undefined {
  if (!poolInfo) return undefined;

  return getStakingPoolState(poolInfo);
}
