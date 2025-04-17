import { BoxProps } from "components/Mui";
import { AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useFarmState, useUserFarmInfo, useFarmInitArgs } from "@icpswap/hooks";
import { FilterState } from "types/staking-farm";

import { FinishedFarmRowUI } from "./FinishedFarmRow";
import { LiveFarmRow } from "./LiveFarmRow";

interface FarmRowProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
}

export function FarmRow({ farmId, wrapperSx, showState, your, filterState }: FarmRowProps) {
  const principal = useAccountPrincipal();

  const { result: farmInitArgs } = useFarmInitArgs(farmId);
  const { result: farmInfo } = useUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
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
      />
    )
  ) : null;
}
