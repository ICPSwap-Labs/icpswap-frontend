import { Typography, Box, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Null, type StakingPoolControllerPoolInfo, type StakingPoolInfo } from "@icpswap/types";
import { useStateColors } from "hooks/staking-token";
import { useStakingPoolState } from "@icpswap/hooks";
import upperFirst from "lodash/upperFirst";
import { ReactNode } from "react";

interface StateProps {
  poolInfo: StakingPoolControllerPoolInfo | StakingPoolInfo | Null;
  noState?: ReactNode;
}

export function State({ poolInfo, noState }: StateProps) {
  const theme = useTheme();
  const state = useStakingPoolState(poolInfo);
  const stateColor = useStateColors(state);

  return state ? (
    <Box sx={{ padding: "6px 8px", borderRadius: "8px", background: theme.palette.background.level4 }}>
      <Flex gap="0 4px">
        <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", background: stateColor }} />
        <Typography fontSize="12px" sx={{ color: stateColor }}>
          {state === "NOT_STARTED" ? "Unstart" : state ? upperFirst(state.toLocaleLowerCase()) : "--"}
        </Typography>
      </Flex>
    </Box>
  ) : noState ? (
    <>{noState}</>
  ) : null;
}
