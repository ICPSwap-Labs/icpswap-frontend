import React from "react";
import { Button, CircularProgress, Box } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { useAccountPrincipal, useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useLoadingTip, useTips, MessageTypes } from "hooks/useTips";
import { StepViewButton } from "components/index";
import { useHarvestCall } from "hooks/staking-token/useHarvest";

export interface HarvestProps {
  rewardToken: Token | undefined | null;
  pool: StakingPoolControllerPoolInfo | undefined | null;
  reward: number | undefined;
}

export default function Harvest({ rewardToken, reward, pool }: HarvestProps) {
  const walletIsConnected = useConnectorStateConnected();
  const principal = useAccountPrincipal();
  const [openTip] = useTips();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [loading, setLoading] = React.useState(false);

  const getHarvestCall = useHarvestCall();

  const handleHarvest = async () => {
    if (loading || !pool || !principal || !rewardToken) return;

    setLoading(true);

    const poolCanisterId = pool.canisterId.toString();

    const { call, key } = await getHarvestCall({ token: rewardToken, poolId: poolCanisterId });

    const loadingTipKey = openLoadingTip(`Harvest ${rewardToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (result) {
      openTip(t`Harvest successfully`, MessageTypes.success);
    }

    closeLoadingTip(loadingTipKey);
    setLoading(false);
  };

  const noRewardToken =
    (!!rewardToken && !!reward && parseTokenAmount(rewardToken.transFee, rewardToken.decimals).isGreaterThan(reward)) ||
    !rewardToken ||
    !reward ||
    reward === 0;

  return (
    <Box>
      {walletIsConnected ? (
        <Button
          disabled={loading || noRewardToken}
          fullWidth
          style={{ height: "42px" }}
          variant="contained"
          size="large"
          color="primary"
          onClick={handleHarvest}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t`Harvest`}
        </Button>
      ) : (
        <ConnectWallet style={{ whiteSpace: "nowrap" }} />
      )}
    </Box>
  );
}
