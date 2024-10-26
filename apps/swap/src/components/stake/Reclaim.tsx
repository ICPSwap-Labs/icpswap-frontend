import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Typography, Box, Button, CircularProgress } from "components/Mui";
import { NoData, LoadingRow, TokenImage, Flex } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useTips, MessageTypes } from "hooks/useTips";
import { useUserUnusedTokenByPool } from "hooks/staking-token/index";
import { stakingPoolClaim, stakingPoolWithdraw } from "@icpswap/hooks";
import { usePendingRewardsByPool } from "hooks/staking-token/usePendingRewards";
import { Token } from "@icpswap/swap-sdk";

import { ReclaimContext } from "./reclaimContext";

interface ReclaimItemProps {
  tokenId: string;
  poolId: string;
  balance: bigint;
  onReclaim: (poolId: string, balance: bigint) => Promise<void>;
}

function ReclaimItem({ tokenId, poolId, balance, onReclaim }: ReclaimItemProps) {
  const [loading, setLoading] = useState(false);
  const { result: token } = useTokenInfo(tokenId);

  const error = useMemo(() => {
    if (!token || !balance) return t`Reclaim`;
    if (balance <= token.transFee) return t`Reclaim`;

    return undefined;
  }, [token, balance]);

  const handleClaim = useCallback(async () => {
    setLoading(true);
    await onReclaim(poolId, balance);
    setLoading(false);
  }, [loading, setLoading]);

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
          {error ?? <Trans>Reclaim</Trans>}
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

export function Reclaim({ poolId, rewardToken, stakeToken, refresh, onReclaimSuccess }: ReclaimProps) {
  const [openTip] = useTips();
  const { setReclaimable } = useContext(ReclaimContext);
  const [trigger, setTrigger] = useState(0);
  const { loading: unusedLoading, result: unusedToken } = useUserUnusedTokenByPool(
    poolId,
    stakeToken?.address,
    trigger,
  );
  const { loading: pendingRewardLoading, result: pendingRewards } = usePendingRewardsByPool(poolId, trigger);

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
        openTip(t`The claim seems to have been successful. Please refresh the page and try again.`, MessageTypes.error);
      } else {
        openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
      }
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
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
          t`The withdrawal seems to have been successful. Please refresh the page and try again.`,
          MessageTypes.error,
        );
      } else {
        openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
      }
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
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
  }, [unusedToken, claimableRewards, claimableStakingAmount]);

  useEffect(() => {
    setTrigger(trigger + 1);
  }, [refresh]);

  return (
    <>
      <Typography sx={{ margin: "16px 0", fontSize: "12px", lineHeight: "18px" }}>
        <Trans>
          For your funds' safety on ICPSwap and to make it more convenient for you to reclaim your staked or reward
          tokens, we've implemented the 'Reclaim' feature. You can use this feature in case of issues during staking,
          unstaking, reward claims, or transaction failures due to token canister issues. It allows you to retrieve and
          reclaim your tokens when issues occur!
        </Trans>
      </Typography>

      <>
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
          <NoData />
        ) : (
          <Box>
            {unusedToken && unusedToken?.balance && unusedToken?.balance > BigInt(0) && poolId && stakeToken ? (
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
    </>
  );
}
