import { useContext, useEffect, useMemo, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { NoData, LoadingRow, TokenImage, Flex } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useTips, MessageTypes, useFullscreenLoading } from "hooks/useTips";
import { useUserUnusedTokens } from "hooks/staking-token/index";
import { stakingPoolClaim, stakingPoolWithdraw } from "@icpswap/hooks";
import { usePendingRewards } from "hooks/staking-token/usePendingRewards";
import { ReclaimContext } from "./reclaimContext";

interface ReclaimItemProps {
  tokenId: string;
  poolId: string;
  balance: bigint;
  onReclaim: (poolId: string, balance: bigint) => void;
}

function ReclaimItem({ tokenId, poolId, balance, onReclaim }: ReclaimItemProps) {
  const { result: token } = useTokenInfo(tokenId);

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
        <Button size="small" variant="contained" onClick={() => onReclaim(poolId, balance)}>
          <Trans>Reclaim</Trans>
        </Button>
      </Box>
    </Flex>
  );
}

export interface ReclaimProps {
  onReclaimSuccess?: () => void;
}

export function Reclaim({ onReclaimSuccess }: ReclaimProps) {
  const [openTip] = useTips();
  const { setReclaimable } = useContext(ReclaimContext);
  const [trigger, setTrigger] = useState(0);
  const [openFullscreen, closeFullscreen] = useFullscreenLoading();
  const { loading: unusedLoading, result: unusedTokens } = useUserUnusedTokens(trigger);
  const { loading: pendingRewardLoading, result: pendingRewards } = usePendingRewards(trigger);

  const { claimableStakingAmount, claimableRewards } = useMemo(() => {
    if (!pendingRewards) return {};

    const claimableStakingAmount = pendingRewards.filter((e) => e.stakingAmount !== BigInt(0));
    const claimableRewards = pendingRewards.filter((e) => e.rewardAmount !== BigInt(0));

    return { claimableStakingAmount, claimableRewards };
  }, [pendingRewards]);

  const handleReclaim = async (poolId: string) => {
    openFullscreen();

    const { status, message } = await stakingPoolClaim(poolId);

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
      if (onReclaimSuccess) onReclaimSuccess();
    }

    closeFullscreen();
  };

  const handleWithdraw = async (poolId: string, balance: bigint) => {
    openFullscreen();

    const { status, message } = await stakingPoolWithdraw(poolId, true, balance);

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
      if (onReclaimSuccess) onReclaimSuccess();
    }

    closeFullscreen();
  };

  useEffect(() => {
    if (
      (unusedTokens && unusedTokens.length > 0) ||
      (claimableRewards && claimableRewards.length > 0) ||
      (claimableStakingAmount && claimableStakingAmount.length > 0)
    ) {
      setReclaimable(true);
    } else {
      setReclaimable(false);
    }
  }, [unusedTokens, claimableRewards, claimableStakingAmount]);

  return (
    <>
      <Typography sx={{ margin: "16px 0", fontSize: "12px" }}>
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
        ) : unusedTokens.length === 0 && claimableStakingAmount?.length === 0 && claimableRewards?.length === 0 ? (
          <NoData />
        ) : (
          <Box>
            {unusedTokens.map((ele) => (
              <ReclaimItem
                key={ele.poolId}
                poolId={ele.poolId}
                balance={ele.balance}
                tokenId={ele.stakingToken.address}
                onReclaim={handleReclaim}
              />
            ))}

            {claimableStakingAmount?.map((ele) => (
              <ReclaimItem
                key={`${ele.poolId}_staking_token`}
                poolId={ele.poolId}
                balance={ele.stakingAmount}
                tokenId={ele.stakeTokenId}
                onReclaim={handleWithdraw}
              />
            ))}

            {claimableRewards?.map((ele) => (
              <ReclaimItem
                key={`${ele.poolId}_rewards`}
                poolId={ele.poolId}
                balance={ele.rewardAmount}
                tokenId={ele.rewardTokenId}
                onReclaim={handleReclaim}
              />
            ))}
          </Box>
        )}
      </>
    </>
  );
}
