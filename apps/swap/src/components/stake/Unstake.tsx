import { useState } from "react";
import { Button } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { UnstakeModal } from "components/stake/UnstakeModal";
import { isNullArgs } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

export interface UnstakeProps {
  poolId: string | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  stakeAmount: bigint | undefined;
  rewardAmount: bigint | undefined;
  onUnStakeSuccess?: () => void;
  stakeTokenPrice: string | number | undefined;
  rewardTokenPrice: string | number | undefined;
}

export function Unstake({
  poolId,
  stakeToken,
  stakeAmount,
  rewardToken,
  onUnStakeSuccess,
  rewardTokenPrice,
  rewardAmount,
}: UnstakeProps) {
  const { t } = useTranslation();
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
        {t("common.unstake")}
      </Button>

      <UnstakeModal
        open={unStakeOpen}
        stakeAmount={stakeAmount}
        onClose={() => setUnstakeOpen(false)}
        rewardToken={rewardToken}
        stakeToken={stakeToken}
        poolId={poolId}
        onUnStakeSuccess={onUnStakeSuccess}
        rewardTokenPrice={rewardTokenPrice}
        rewardAmount={rewardAmount}
      />
    </>
  );
}
