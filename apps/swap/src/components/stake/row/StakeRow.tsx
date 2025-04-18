import { BoxProps } from "components/Mui";
import { StakingState, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useStakingPoolState } from "@icpswap/hooks";
import { FilterState } from "types/staking-token";

import { FinishedRow } from "./FinishedRow";
import { LiveRow } from "./LiveRow";
import { EmptyRow } from "./EmptyRow";

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
