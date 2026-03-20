import { useStakingPoolState } from "@icpswap/hooks";
import { type StakingPoolControllerPoolInfo, StakingState } from "@icpswap/types";
import type { BoxProps } from "components/Mui";
import type { FilterState } from "types/staking-token";
import { EmptyRow } from "./EmptyRow";
import { FinishedRow } from "./FinishedRow";
import { LiveRow } from "./LiveRow";

interface StakeRowProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
  filterState: FilterState;
  your?: boolean;
}

export function StakeRow({ poolInfo, wrapperSx, filterState, your, showState }: StakeRowProps) {
  const state = useStakingPoolState(poolInfo);

  return !state ? (
    <EmptyRow poolInfo={poolInfo} wrapperSx={wrapperSx} filterState={filterState} your={your} showState={showState} />
  ) : state === StakingState.LIVE || state === StakingState.NOT_STARTED ? (
    <LiveRow poolInfo={poolInfo} wrapperSx={wrapperSx} filterState={filterState} your={your} showState={showState} />
  ) : (
    <FinishedRow
      poolInfo={poolInfo}
      wrapperSx={wrapperSx}
      filterState={filterState}
      your={your}
      showState={showState}
    />
  );
}
