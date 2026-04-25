import { useFarmInitArgs, useFarmState, useUserFarmInfo } from "@icpswap/hooks";
import { EmptyRow } from "components/farm/row/EmptyRow";
import { FinishedFarmRowUI } from "components/farm/row/FinishedFarmRow";
import { LiveFarmRow } from "components/farm/row/LiveFarmRow";
import type { BoxProps } from "components/Mui";
import { AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import type { FilterState } from "types/staking-farm";

interface FarmRowProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
  isFirst?: boolean;
}

export function FarmRow({ farmId, wrapperSx, showState, your, filterState, isFirst }: FarmRowProps) {
  const principal = useAccountPrincipal();

  const { data: farmInitArgs } = useFarmInitArgs(farmId);
  const { data: farmInfo } = useUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
  const state = useFarmState(farmInfo);

  return farmInfo && state ? (
    state === "FINISHED" || state === "CLOSED" ? (
      <FinishedFarmRowUI
        farmInfo={farmInfo}
        farmId={farmId}
        filterState={filterState}
        your={your}
        showState={showState}
        wrapperSx={wrapperSx}
        initArgs={farmInitArgs}
        isFirst={isFirst}
      />
    ) : (
      <LiveFarmRow
        farmInfo={farmInfo}
        farmId={farmId}
        filterState={filterState}
        your={your}
        showState={showState}
        state={state}
        wrapperSx={wrapperSx}
        initArgs={farmInitArgs}
        isFirst={isFirst}
      />
    )
  ) : (
    <EmptyRow
      farmId={farmId}
      filterState={filterState}
      your={your}
      showState={showState}
      wrapperSx={wrapperSx}
      isFirst={isFirst}
    />
  );
}
