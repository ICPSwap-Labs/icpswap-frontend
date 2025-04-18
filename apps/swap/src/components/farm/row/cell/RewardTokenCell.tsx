import { Flex, BodyCell } from "@icpswap/ui";
import { useToken } from "hooks/useCurrency";
import type { FarmInfo, Null, FarmState } from "@icpswap/types";
import { TokenImage } from "components/index";
import { PendingPanel } from "components/farm/PendingPanel";

interface RewardTokenCellProps {
  farmId: string;
  farmInfo: FarmInfo | Null;
  state: FarmState;
}

export function RewardTokenCell({ farmId, state, farmInfo }: RewardTokenCellProps) {
  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  return (
    <Flex gap="0 8px" className="row-item">
      <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
      <BodyCell sx={{ color: "text.primary" }}>{rewardToken ? `${rewardToken.symbol} ` : "--"}</BodyCell>
      <PendingPanel rewardToken={rewardToken} farmId={farmId} state={state} />
    </Flex>
  );
}
