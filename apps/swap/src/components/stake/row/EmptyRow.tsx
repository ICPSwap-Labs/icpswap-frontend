import { Box, BoxProps, useTheme } from "components/Mui";
import { useCallback } from "react";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useHistory } from "react-router-dom";
import { FilterState } from "types/staking-token";

import { EmptyCell } from "components/stake/row/cell";

interface EmptyRowProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
  filterState: FilterState;
  your?: boolean;
}

export function EmptyRow({ poolInfo, wrapperSx, filterState, your, showState }: EmptyRowProps) {
  const theme = useTheme();
  const history = useHistory();

  const handelToDetails = useCallback(() => {
    history.push(`/stake/details/${poolInfo.canisterId.toString()}`);
  }, [history, poolInfo]);

  return (
    <Box
      sx={{
        ...wrapperSx,
        cursor: "pointer",
        "&:hover": {
          "& .row-item": {
            background: theme.palette.background.level1,
          },
        },
        "& .row-item": {
          padding: "20px 0",
          borderTop: `1px solid ${theme.palette.background.level1}`,
          "&:first-of-type": {
            padding: "20px 0 20px 24px",
          },
          "&:last-of-type": {
            padding: "20px 24px 20px 0",
          },
        },
      }}
      onClick={handelToDetails}
    >
      <EmptyCell />

      <EmptyCell />

      <EmptyCell />

      <EmptyCell />

      {/* Total Staked */}
      {filterState !== FilterState.FINISHED && !your ? <EmptyCell /> : null}

      {/* Your Staked */}
      {your || filterState === FilterState.FINISHED ? <EmptyCell /> : null}

      {/* Total reward tokens */}
      {filterState === FilterState.FINISHED ? <EmptyCell /> : null}

      {/* Your rewards */}
      {your ? <EmptyCell /> : null}

      {showState ? <EmptyCell /> : null}
    </Box>
  );
}
