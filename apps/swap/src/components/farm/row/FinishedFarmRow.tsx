import { Box, BoxProps, useTheme } from "components/Mui";
import { Link, BodyCell, Flex } from "@icpswap/ui";
import type { FarmInfo, InitFarmArgs, Null } from "@icpswap/types";
import { FilterState } from "types/staking-farm";
import {
  TotalStakedCell,
  UserStakedCell,
  UserRewardsCell,
  AvgAprCell,
  PoolCell,
  TotalRewardsCell,
  StateCell,
  RewardTokenCell,
} from "components/farm/row/cell/index";

export interface FinishedFarmRowUIProps {
  farmInfo: FarmInfo;
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
  initArgs: InitFarmArgs | Null;
  isFirst?: boolean;
}

export function FinishedFarmRowUI({
  farmInfo,
  farmId,
  wrapperSx,
  showState,
  your,
  filterState,
  initArgs,
  isFirst,
}: FinishedFarmRowUIProps) {
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
            },
            "&:last-of-type": {
              padding: "20px 24px 20px 0",
            },
          },
        }}
      >
        <PoolCell farmInfo={farmInfo} />

        <RewardTokenCell farmId={farmId} farmInfo={farmInfo} state="FINISHED" />

        <AvgAprCell farmId={farmId} farmInfo={farmInfo} />

        {filterState === FilterState.ALL ? (
          <Flex gap="0 4px" justify="flex-end" className="row-item">
            <>
              <BodyCell>$0.00</BodyCell>
            </>
          </Flex>
        ) : null}

        {your ? <UserRewardsCell farmId={farmId} farmInfo={farmInfo} initArgs={initArgs} /> : null}

        {your || filterState === FilterState.FINISHED ? (
          <UserStakedCell farmId={farmId} farmInfo={farmInfo} />
        ) : (
          <TotalStakedCell farmId={farmId} farmInfo={farmInfo} />
        )}

        {filterState === FilterState.FINISHED ? <TotalRewardsCell farmInfo={farmInfo} /> : null}

        {showState ? <StateCell farmInfo={farmInfo} /> : null}
      </Box>
    </Link>
  );
}
