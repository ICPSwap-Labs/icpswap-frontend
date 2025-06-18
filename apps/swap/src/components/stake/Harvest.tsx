import React, { useMemo } from "react";
import { Button, CircularProgress, Box } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useAccountPrincipal, useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import { useLoadingTip, useTips, MessageTypes } from "hooks/useTips";
import { StepViewButton } from "components/index";
import { useHarvestCall } from "hooks/staking-token/useHarvest";
import { useTranslation } from "react-i18next";

export interface HarvestProps {
  rewardToken: Token | undefined | null;
  poolId: string | undefined | null;
  rewardAmount: bigint | number | undefined;
  onHarvestSuccess?: () => void;
}

export function Harvest({ rewardToken, rewardAmount, poolId, onHarvestSuccess }: HarvestProps) {
  const { t } = useTranslation();
  const walletIsConnected = useConnectorStateConnected();
  const principal = useAccountPrincipal();
  const [openTip] = useTips();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [loading, setLoading] = React.useState(false);

  const getHarvestCall = useHarvestCall();

  const handleHarvest = async () => {
    if (loading || !poolId || !principal || !rewardToken) return;

    setLoading(true);

    const { call, key } = await getHarvestCall({
      token: rewardToken,
      poolId,
      refresh: () => {
        if (onHarvestSuccess) onHarvestSuccess();
      },
    });

    const loadingTipKey = openLoadingTip(`Harvest ${rewardToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (result) {
      openTip(t("stake.harvest.success"), MessageTypes.success);
    }

    closeLoadingTip(loadingTipKey);
    setLoading(false);
  };

  const noRewardToken = useMemo(() => {
    if (isUndefinedOrNull(rewardToken) || isUndefinedOrNull(rewardAmount)) return true;

    if (rewardAmount.toString() === "0") return true;

    return BigInt(rewardAmount) <= rewardToken.transFee;
  }, [rewardToken, rewardAmount]);

  return (
    <Box>
      {walletIsConnected ? (
        <Button
          disabled={loading || noRewardToken}
          fullWidth
          style={{ height: "48px" }}
          variant="contained"
          size="large"
          color="primary"
          onClick={handleHarvest}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t("common.harvest")}
        </Button>
      ) : (
        <ConnectWallet style={{ whiteSpace: "nowrap" }} />
      )}
    </Box>
  );
}
