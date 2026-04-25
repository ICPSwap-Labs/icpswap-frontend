import type { FarmInfo, FarmState, InitFarmArgs, Null } from "@icpswap/types";
import { Link } from "@icpswap/ui";
import {
  AprCell,
  AvailableCell,
  PoolCell,
  RewardTokenCell,
  StateCell,
  TotalStakedCell,
  UserRewardsCell,
  UserStakedCell,
} from "components/farm/row/cell/index";
import { Box, type BoxProps, useTheme } from "components/Mui";
import { FilterState } from "types/staking-farm";

interface LiveFarmRowProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
  farmInfo: FarmInfo | Null;
  state: FarmState;
  initArgs: InitFarmArgs | Null;
  isFirst?: boolean;
}

export function LiveFarmRow({
  farmId,
  wrapperSx,
  state,
  farmInfo,
  your,
  showState,
  filterState,
  initArgs,
  isFirst,
}: LiveFarmRowProps) {
  const theme = useTheme();

  return (
    <Link to={`/farm/details/${farmId}`}>
      <Box
        sx={{
          ...wrapperSx,
          "&:hover": {
            "& .row-item": {
              background: theme.palette.background.level1,
            },
          },
          "& .row-item": {
            borderTop: isFirst ? "none" : `1px solid ${theme.palette.background.level1}`,
            padding: "20px 0",
            "&:first-of-type": {
              padding: "20px 0 20px 24px",
              borderTop: "none",
            },
            "&:last-of-type": {
              padding: "20px 24px 20px 0",
            },
          },
        }}
      >
        <PoolCell farmInfo={farmInfo} />

        <RewardTokenCell farmId={farmId} state={state} farmInfo={farmInfo} />

        <AprCell farmId={farmId} state={state} farmInfo={farmInfo} initArgs={initArgs} />

        {filterState !== FilterState.CLOSED && filterState !== FilterState.FINISHED ? (
          <AvailableCell
            farmId={farmId}
            showState={showState}
            farmInfo={farmInfo}
            filterState={filterState}
            state={state}
            initArgs={initArgs}
          />
        ) : null}

        {your ? <UserRewardsCell farmId={farmId} farmInfo={farmInfo} initArgs={initArgs} /> : null}

        {your || filterState === FilterState.FINISHED ? (
          <UserStakedCell farmId={farmId} farmInfo={farmInfo} />
        ) : (
          <TotalStakedCell farmId={farmId} farmInfo={farmInfo} />
        )}

        {showState ? <StateCell farmInfo={farmInfo} /> : null}
      </Box>
    </Link>
  );
}
