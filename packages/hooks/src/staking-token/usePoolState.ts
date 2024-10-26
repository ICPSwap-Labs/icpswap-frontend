import { nowInSeconds } from "@icpswap/utils";
import { StakingPoolControllerPoolInfo, StakingState, StakingPoolInfo } from "@icpswap/types";

export function getStakingPoolState(poolInfo: StakingPoolControllerPoolInfo | StakingPoolInfo): StakingState {
  const now = nowInSeconds();

  if (poolInfo.startTime > BigInt(now)) return StakingState.NOT_STARTED;
  if (poolInfo.bonusEndTime <= BigInt(now)) return StakingState.FINISHED;

  return StakingState.LIVE;
}

export function useStakingPoolState(
  poolInfo: StakingPoolControllerPoolInfo | StakingPoolInfo | undefined,
): StakingState | undefined {
  if (!poolInfo) return undefined;

  return getStakingPoolState(poolInfo);
}
