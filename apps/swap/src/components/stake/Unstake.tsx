import { useState } from "react";
import { Button } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { UnstakeModal } from "components/stake/UnstakeModal";
import { isNullArgs } from "@icpswap/utils";

export interface UnstakeProps {
  poolId: string | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  stakeAmount: bigint | undefined;
  onUnStakeSuccess?: () => void;
  stakeTokenPrice: string | number | undefined;
}

export function Unstake({
  poolId,
  stakeToken,
  stakeAmount,
  rewardToken,
  onUnStakeSuccess,
  stakeTokenPrice,
}: UnstakeProps) {
  const [unStakeOpen, setUnstakeOpen] = useState(false);

  const handleUnstake = () => {
    setUnstakeOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        sx={{ height: "48px" }}
        onClick={handleUnstake}
        disabled={isNullArgs(stakeAmount) || stakeAmount === BigInt(0)}
      >
        <Trans>Unstake</Trans>
      </Button>

      <UnstakeModal
        open={unStakeOpen}
        stakeAmount={stakeAmount}
        onClose={() => setUnstakeOpen(false)}
        rewardToken={rewardToken}
        stakeToken={stakeToken}
        poolId={poolId}
        onUnStakeSuccess={onUnStakeSuccess}
        stakeTokenPrice={stakeTokenPrice}
      />
    </>
  );
}
