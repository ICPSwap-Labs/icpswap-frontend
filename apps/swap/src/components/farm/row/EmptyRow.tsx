import { Box, BoxProps, useTheme } from "components/Mui";
import { Link } from "@icpswap/ui";
import { FilterState } from "types/staking-farm";
import { EmptyCell } from "components/farm/row/cell";

interface EmptyRowProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
}

export function EmptyRow({ farmId, wrapperSx, showState, your, filterState }: EmptyRowProps) {
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
            borderTop: `1px solid ${theme.palette.background.level1}`,
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
        <EmptyCell justify="flex-start" />

        <EmptyCell justify="flex-start" />

        <EmptyCell />

        {filterState === FilterState.FINISHED ? null : <EmptyCell />}

        {your ? <EmptyCell /> : null}

        {your || filterState === FilterState.FINISHED ? <EmptyCell /> : <EmptyCell />}

        {filterState === FilterState.FINISHED ? <EmptyCell /> : null}

        {showState ? <EmptyCell /> : null}
      </Box>
    </Link>
  );
}
