import { stakingPoolClaim, stakingPoolWithdraw } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ResultStatus } from "@icpswap/types";
import { parseTokenAmount } from "@icpswap/utils";
import { Flex, LoadingRow, NoData, TokenImage } from "components/index";
import { Box, Button, CircularProgress, Typography } from "components/Mui";
import { useToken } from "hooks/index";
import { useUserUnusedTokenByPool } from "hooks/staking-token/index";
import { usePendingRewardsByPool } from "hooks/staking-token/usePendingRewards";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ReclaimContext } from "./reclaimContext";

interface ReclaimItemProps {
  tokenId: string;
  poolId: string;
  balance: bigint;
  onReclaim: (poolId: string, balance: bigint) => Promise<void>;
}

function ReclaimItem({ tokenId, poolId, balance, onReclaim }: ReclaimItemProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [, token] = useToken(tokenId);

  const error = useMemo(() => {
    if (!token || !balance) return t`Reclaim`;
    if (balance <= BigInt(token.transFee)) return t`Reclaim`;

    return undefined;
  }, [token, balance, t]);

  const handleClaim = useCallback(async () => {
    setLoading(true);
    await onReclaim(poolId, balance);
    setLoading(false);
  }, [balance, onReclaim, poolId]);

  return (
    <Flex justify="space-between" sx={{ padding: "16px 0" }}>
      <Flex gap="0 12px">
        <TokenImage logo={token?.logo} size="32px" />
        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "text.primary" }}>
            {parseTokenAmount(balance, token?.decimals).toFormat()}
          </Typography>
          <Typography sx={{ margin: "8px 0 0 0" }}>{token?.symbol ?? "--"}</Typography>
        </Box>
      </Flex>

      <Box>
        <Button
          size="small"
          variant="contained"
          onClick={handleClaim}
          disabled={!!error || loading}
          startIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}
        >
          {error ?? t("common.reclaim")}
        </Button>
      </Box>
    </Flex>
  );
}

export interface ReclaimProps {
  onReclaimSuccess?: () => void;
  poolId: string | undefined;
  rewardToken: Token | undefined;
  stakeToken: Token | undefined;
  refresh?: boolean;
}

export function Reclaim({ poolId, rewardToken, stakeToken, onReclaimSuccess }: ReclaimProps) {
  const { t } = useTranslation();
  const [openTip] = useTips();
  const { setReclaimable } = useContext(ReclaimContext);

  const {
    isLoading: unusedLoading,
    data: unusedToken,
    refetch: refetchUnusedToken,
  } = useUserUnusedTokenByPool(poolId, stakeToken?.address);
  const { isLoading: pendingRewardLoading, data: pendingRewards, refetch } = usePendingRewardsByPool(poolId);

  const handleRefetch = useCallback(() => {
    refetchUnusedToken();
    refetch();
  }, [refetchUnusedToken, refetch]);

  const { claimableStakingAmount, claimableRewards } = useMemo(() => {
    if (!pendingRewards) return {};

    const claimableStakingAmount = pendingRewards.stakingAmount;
    const claimableRewards = pendingRewards.rewardAmount;

    return { claimableStakingAmount, claimableRewards };
  }, [pendingRewards]);

  const handleReclaim = async (poolId: string) => {
    const { status, message } = await stakingPoolClaim(poolId);

    if (status === ResultStatus.ERROR) {
      if (message === "The claim amount is less than the transfer fee of the staking token") {
        openTip(`The claim seems to have been successful. Please refresh the page and try again.`, MessageTypes.error);
      } else {
        openTip(message ?? `Failed to reclaim`, MessageTypes.error);
      }
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      handleRefetch();
      if (onReclaimSuccess) onReclaimSuccess();
    }
  };

  const handleWithdraw = async (poolId: string, balance: bigint, isStakeToken: boolean) => {
    const { status, message } = await stakingPoolWithdraw(poolId, isStakeToken, balance);

    if (status === ResultStatus.ERROR) {
      if (
        message === "The withdraw amount is less than the transfer fee of the staking token" ||
        message === "The withdraw amount is less than the transfer fee of the reward token"
      ) {
        openTip(
          `The withdrawal seems to have been successful. Please refresh the page and try again.`,
          MessageTypes.error,
        );
      } else {
        openTip(message ?? `Failed to reclaim`, MessageTypes.error);
      }
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      handleRefetch();
      if (onReclaimSuccess) onReclaimSuccess();
    }
  };

  useEffect(() => {
    if (
      (unusedToken && (unusedToken.balance ?? BigInt(0)) > BigInt(0)) ||
      (claimableRewards && claimableRewards > BigInt(0)) ||
      (claimableStakingAmount && claimableStakingAmount > BigInt(0))
    ) {
      setReclaimable(true);
    } else {
      setReclaimable(false);
    }
  }, [unusedToken, claimableRewards, claimableStakingAmount, setReclaimable]);

  return (
    <>
      <Typography sx={{ margin: "16px 0", fontSize: "12px", lineHeight: "18px" }}>
        {t("stake.reclaim.descriptions")}
      </Typography>

      {unusedLoading || pendingRewardLoading ? (
        <Box sx={{ padding: "20px 0" }}>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : unusedToken && unusedToken.balance === BigInt(0) && !claimableStakingAmount && !claimableRewards ? (
        <NoData tip={t("stake.reclaim.empty")} />
      ) : (
        <Box>
          {unusedToken?.balance && unusedToken?.balance > BigInt(0) && poolId && stakeToken ? (
            <ReclaimItem
              poolId={poolId}
              balance={unusedToken.balance}
              tokenId={stakeToken.address}
              onReclaim={handleReclaim}
            />
          ) : null}

          {claimableStakingAmount && claimableStakingAmount > BigInt(0) && poolId && stakeToken ? (
            <ReclaimItem
              poolId={poolId}
              balance={claimableStakingAmount}
              tokenId={stakeToken.address}
              onReclaim={(poolId: string, amount: bigint) => handleWithdraw(poolId, amount, true)}
            />
          ) : null}

          {claimableRewards && claimableRewards > BigInt(0) && poolId && rewardToken ? (
            <ReclaimItem
              poolId={poolId}
              balance={claimableRewards}
              tokenId={rewardToken.address}
              onReclaim={(poolId: string, amount: bigint) => handleWithdraw(poolId, amount, false)}
            />
          ) : null}
        </Box>
      )}
    </>
  );
}
