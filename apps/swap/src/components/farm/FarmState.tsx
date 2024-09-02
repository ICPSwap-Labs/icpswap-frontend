import { Typography, Box, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useFarmState } from "@icpswap/hooks";
import { type FarmInfo } from "@icpswap/types";
import { useStateColors } from "hooks/staking-farm";
import upperFirst from "lodash/upperFirst";

export interface FarmStateChipProps {
  farmInfo: FarmInfo;
}

export function FarmStateChip({ farmInfo }: FarmStateChipProps) {
  const theme = useTheme();
  const state = useFarmState(farmInfo);
  const stateColor = useStateColors(state);

  return (
    <Box
      sx={{
        padding: "6px 8px",
        background: theme.palette.background.level4,
        borderRadius: "8px",
      }}
    >
      {state ? (
        <Flex gap="0 4px">
          <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", background: stateColor }} />
          <Typography sx={{ color: stateColor, fontSize: "12px" }}>
            {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
          </Typography>
        </Flex>
      ) : (
        "--"
      )}
    </Box>
  );
}
