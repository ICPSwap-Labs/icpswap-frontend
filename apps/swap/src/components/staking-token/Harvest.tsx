import React from "react";
import { Grid, Button, CircularProgress } from "@mui/material";
import { useTips, TIP_SUCCESS, TIP_ERROR } from "hooks/useTips";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps } from "components/Identity";
import { t } from "@lingui/macro";
import { useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import type { ActorIdentity, StakingPoolControllerPoolInfo } from "@icpswap/types";
import { harvest } from "hooks/staking-token/index";

export interface ClaimRewardProps {
  rewardToken: Token | undefined | null;
  pool: StakingPoolControllerPoolInfo | undefined | null;
  reward: number;
}

export default function ClaimReward({ rewardToken, reward, pool }: ClaimRewardProps) {
  const [openTip] = useTips();
  const walletIsConnected = useConnectorStateConnected();
  const [loading, setLoading] = React.useState(false);

  const handleClaimReward = async (identity: ActorIdentity) => {
    if (loading || !pool) return;

    setLoading(true);

    const { status, message } = await harvest(pool.canisterId, pool.version, identity);

    if (status === ResultStatus.OK) {
      openTip(t`Harvest successfully`, TIP_SUCCESS);
    } else {
      openTip(getLocaleMessage(message), TIP_ERROR);
    }

    setLoading(false);
  };

  const noRewardToken =
    (!!rewardToken && !!reward && parseTokenAmount(rewardToken.transFee, rewardToken.decimals).isGreaterThan(reward)) ||
    !rewardToken ||
    !reward ||
    reward === 0;

  return (
    <Grid>
      {walletIsConnected ? (
        <Identity onSubmit={handleClaimReward}>
          {({ submit }: CallbackProps) => (
            <Button
              disabled={loading || noRewardToken}
              fullWidth
              style={{ height: "42px" }}
              variant="contained"
              size="large"
              color="primary"
              onClick={submit}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {t`Harvest`}
            </Button>
          )}
        </Identity>
      ) : (
        <ConnectWallet style={{ whiteSpace: "nowrap" }} />
      )}
    </Grid>
  );
}
