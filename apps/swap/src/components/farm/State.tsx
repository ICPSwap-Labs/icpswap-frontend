import { ReactNode } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useFarmState } from "@icpswap/hooks";
import { FarmInfo, Null } from "@icpswap/types";
import { useStateColors } from "hooks/staking-farm";
import upperFirst from "lodash/upperFirst";

interface StateProps {
  farmInfo: FarmInfo | Null;
  noState?: ReactNode;
}

export function State({ farmInfo, noState }: StateProps) {
  const theme = useTheme();
  const state = useFarmState(farmInfo);
  const stateColor = useStateColors(state);

  return state ? (
    <Box sx={{ padding: "6px 8px", borderRadius: "8px", background: theme.palette.background.level4 }}>
      <Flex gap="0 4px">
        <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", background: stateColor }} />
        <Typography fontSize="12px" sx={{ color: stateColor }}>
          {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
        </Typography>
      </Flex>
    </Box>
  ) : noState ? (
    <>{noState}</>
  ) : null;
}
