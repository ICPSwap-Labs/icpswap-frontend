import { StakingState } from "@icpswap/types";
import { FilterState } from "types/staking-token";

export function getStateValue(state: StakingState) {
  switch (state) {
    case StakingState.LIVE:
      return BigInt(2);
    case StakingState.NOT_STARTED:
      return BigInt(1);
    case StakingState.FINISHED:
      return BigInt(3);
    default:
      return undefined;
  }
}

export function getStateValueByFilterState(__state: FilterState) {
  switch (__state) {
    case FilterState.ALL:
      return undefined;
    case FilterState.NOT_STARTED:
      return getStateValue(StakingState.NOT_STARTED);
    case FilterState.LIVE:
      return getStateValue(StakingState.LIVE);
    case FilterState.FINISHED:
      return getStateValue(StakingState.FINISHED);
    case FilterState.YOUR:
      return undefined;
    default:
      return undefined;
  }
}
