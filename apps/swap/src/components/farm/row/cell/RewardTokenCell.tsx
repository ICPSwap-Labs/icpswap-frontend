import type { FarmInfo, FarmState, Null } from "@icpswap/types";
import { BodyCell, Flex } from "@icpswap/ui";
import { PendingPanel } from "components/farm/PendingPanel";
import { TokenImage } from "components/index";
import { useToken } from "hooks/useCurrency";

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
