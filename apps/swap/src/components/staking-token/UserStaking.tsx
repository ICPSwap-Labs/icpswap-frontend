import React, { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { parseTokenAmount, toSignificantWithGroupSeparator, nonNullArgs, isNullArgs } from "@icpswap/utils";
import type { StakingPoolUserInfo, StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import CountUp from "react-countup";
import { Trans } from "@lingui/macro";
import { useConnectorStateConnected, useAccountPrincipalString } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import { useICPPrice } from "store/global/hooks";
import { STATE } from "types/staking-token";
import Harvest from "components/staking-token/Harvest";
import { Flex } from "components/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";

export interface UserStakingProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  poolData: StakingPoolInfo | undefined | null;
  StakingAndClaim: React.ReactNode;
  userStakingInfo: StakingPoolUserInfo | undefined | null;
  rewardToken: Token | undefined | null;
  stakingToken: Token | undefined | null;
  rewardTokenPrice: string | number | undefined | null;
  stakingTokenPrice: string | number | undefined | null;
  state: STATE | undefined;
  refreshTrigger: number;
}

export default function UserStaking({
  pool,
  poolData,
  StakingAndClaim,
  userStakingInfo,
  rewardToken,
  stakingToken,
  rewardTokenPrice,
  stakingTokenPrice,
  state,
  refreshTrigger,
}: UserStakingProps) {
  const principal = useAccountPrincipalString();
  const ICPPrice = useICPPrice();

  const { result: userStakeTokenBalance } = useTokenBalance(pool?.stakingToken.address, principal, refreshTrigger);

  const { totalDeposit, totalDepositUSD } = useMemo(() => {
    if (!poolData || !stakingToken) return {};

    const totalDeposit = parseTokenAmount(poolData.totalDeposit, stakingToken.decimals).toNumber();

    return {
      totalDeposit,
      totalDepositUSD: stakingTokenPrice
        ? new BigNumber(totalDeposit).multipliedBy(stakingTokenPrice).toNumber()
        : undefined,
    };
  }, [poolData, stakingToken, stakingTokenPrice]);

  // apr = (amountPerSecond * 3600  * 24 * 365) / totalStakedAmount * 100 * (rewardTokenPrice / stakedTokenPrice)
  const apr = useMemo(() => {
    if (poolData?.rewardPerTime && stakingToken && rewardToken && totalDeposit) {
      const poolInfoPerSecond = Number(poolData.rewardPerTime);
      if (ICPPrice && rewardTokenPrice && stakingTokenPrice && rewardToken.decimals && poolInfoPerSecond > 0) {
        const perSecond = parseTokenAmount(poolInfoPerSecond, rewardToken.decimals).toNumber();
        // apr={(perSecond*3600*24*365)/ totalDeposit} * 100
        // const a = ((ICPPrice * rewardTokenPrice ? new BigNumber(rewardTokenPrice).toNumber() : 1 * perSecond * 31536000) / (ICPPrice * totalDeposit * 2)) * 100;
        // const a = ((perSecond * 3600 * 24 * 365) / totalDeposit) * 100;
        const a =
          ((perSecond * 3600 * 24 * 365) / totalDeposit) *
          100 *
          new BigNumber(rewardTokenPrice).dividedBy(stakingTokenPrice).toNumber();

        return Number.isFinite(a) ? a : 0;
      }
    }
    return 0;
  }, [ICPPrice, totalDeposit, poolData, rewardToken, rewardTokenPrice, stakingTokenPrice, stakingToken]);

  const { stakingAmount, stakingUSDValue } = useMemo(() => {
    if (!userStakingInfo || !stakingToken) return {};

    const stakingAmount = parseTokenAmount(userStakingInfo.stakeAmount, stakingToken.decimals).toNumber();

    const stakingUSDValue = isNullArgs(stakingTokenPrice)
      ? undefined
      : new BigNumber(stakingAmount).multipliedBy(stakingTokenPrice).toNumber();

    return { stakingAmount, stakingUSDValue };
  }, [userStakingInfo, stakingToken, rewardTokenPrice]);

  const { pendingReward, pendingRewardUSD } = useMemo(() => {
    if (!rewardToken || !userStakingInfo) return {};

    const pendingReward = parseTokenAmount(userStakingInfo.pendingReward, rewardToken.decimals).toNumber();
    const pendingRewardUSD = isNullArgs<string | number>(rewardTokenPrice)
      ? undefined
      : new BigNumber(pendingReward).multipliedBy(rewardTokenPrice).toNumber();

    return { pendingReward, pendingRewardUSD };
  }, [userStakingInfo, rewardToken, rewardTokenPrice]);

  const walletIsConnected = useConnectorStateConnected();

  return (
    <Box sx={{ padding: "24px", display: "flex", gap: "24px 0", flexDirection: "column" }}>
      <Flex justify="space-between" align="center">
        <Typography sx={{ fontWeight: 600 }}>
          <Trans>APR</Trans>
        </Typography>

        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {state === STATE.FINISHED ? (
            "--"
          ) : (
            <CountUp preserveValue end={apr} decimals={2} duration={1} suffix="%" separator="," />
          )}
        </Typography>
      </Flex>

      <Flex justify="space-between" align="center">
        <Typography sx={{ fontWeight: 600 }}>
          <Trans>Total Staked</Trans>
        </Typography>

        <Box>
          <Typography sx={{ textAlign: "right", color: "text.primary", fontWeight: 600 }}>
            {nonNullArgs<number>(totalDeposit) && rewardToken
              ? `${toSignificantWithGroupSeparator(totalDeposit, 6)} ${rewardToken.symbol}`
              : "--"}
          </Typography>
          <Typography sx={{ textAlign: "right", color: "text.primary", fontWeight: 600 }}>
            {nonNullArgs<number>(totalDepositUSD) ? `~${new BigNumber(totalDepositUSD).toFormat(2)}` : "--"}
          </Typography>
        </Box>
      </Flex>

      <Flex justify="space-between" align="flex-start">
        <Typography>
          <Trans>Your Available to Stake</Trans>
        </Typography>

        <Box>
          <Typography sx={{ textAlign: "right", color: "text.primary" }}>
            {userStakeTokenBalance && rewardToken
              ? toSignificantWithGroupSeparator(
                  parseTokenAmount(userStakeTokenBalance, rewardToken.decimals).toNumber(),
                  6,
                )
              : "--"}
          </Typography>
          <Typography sx={{ textAlign: "right", color: "text.primary" }}>
            {userStakeTokenBalance && rewardToken && rewardTokenPrice
              ? `~${parseTokenAmount(userStakeTokenBalance, rewardToken.decimals)
                  .multipliedBy(rewardTokenPrice)
                  .toFormat(2)}`
              : "--"}
          </Typography>
        </Box>
      </Flex>

      <Box>
        <Box sx={{ marginBottom: "14px" }}>
          <Typography>
            <Trans>{pool ? pool.rewardTokenSymbol : "--"} Earned</Trans>
          </Typography>
        </Box>

        <Flex justify="space-between" align="flex-start">
          <Box>
            <Typography color="text.primary">
              {nonNullArgs<number>(pendingReward) ? (
                <CountUp
                  style={{ fontSize: 24 }}
                  preserveValue
                  end={pendingReward}
                  decimals={4}
                  duration={1}
                  separator=","
                />
              ) : (
                "--"
              )}
            </Typography>
            <Typography color="text.primary">
              {nonNullArgs<number>(pendingRewardUSD) ? (
                <CountUp
                  style={{ fontSize: 14 }}
                  preserveValue
                  end={pendingRewardUSD}
                  decimals={2}
                  duration={1}
                  separator=","
                  prefix="~$"
                />
              ) : (
                "--"
              )}
            </Typography>
          </Box>

          <Harvest rewardToken={rewardToken} reward={pendingReward} pool={pool} />
        </Flex>
      </Box>

      <Grid item xs={12}>
        <Box sx={{ marginBottom: "14px" }}>
          <Typography fontSize="14px">
            <Trans>Your Stake:</Trans>
          </Typography>
        </Box>

        <Flex justify="space-between" align="center">
          <Box>
            <Typography color="text.primary">
              {stakingAmount !== undefined ? (
                <CountUp
                  style={{ fontSize: 24 }}
                  preserveValue
                  end={stakingAmount}
                  decimals={4}
                  duration={1}
                  separator=","
                />
              ) : (
                "--"
              )}
            </Typography>
            <Typography color="text.primary">
              {stakingUSDValue ? (
                <CountUp
                  style={{ fontSize: 14 }}
                  preserveValue
                  end={stakingUSDValue}
                  decimals={2}
                  duration={1}
                  separator=","
                  prefix="~$"
                />
              ) : null}
            </Typography>
          </Box>
          <Box>{walletIsConnected ? StakingAndClaim : <ConnectWallet />}</Box>
        </Flex>
      </Grid>
    </Box>
  );
}
