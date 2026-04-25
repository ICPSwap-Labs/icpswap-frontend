import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { State } from "components/stake/State";

interface StateCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
}

export function StateCell({ poolInfo }: StateCellProps) {
  return (
    <Flex justify="flex-end" className="row-item">
      <State poolInfo={poolInfo} noState={<Typography sx={{ color: "text.primary" }}>--</Typography>} />
    </Flex>
  );
}
