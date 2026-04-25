import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { BodyCell, Flex } from "@icpswap/ui";
import { TokenImage } from "components/Image";
import { useToken } from "hooks/useCurrency";

interface RewardTokenCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
}

export function RewardTokenCell({ poolInfo }: RewardTokenCellProps) {
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);

  return (
    <Flex gap="0 8px" className="row-item">
      <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
      <BodyCell
        sx={{
          width: "150px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={rewardToken?.symbol ?? ""}
      >
        {rewardToken ? `${rewardToken.symbol} ` : "--"}
      </BodyCell>
    </Flex>
  );
}
