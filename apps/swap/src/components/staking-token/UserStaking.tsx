import React, { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import CountUp from "react-countup";
import { Trans } from "@lingui/macro";
import { useConnectorStateConnected, useAccountPrincipalString } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import { useICPPrice } from "store/global/hooks";
import { PoolData, UserStakingInfo, STATE } from "types/staking-token";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import Harvest from "components/staking-token/Harvest";
import { Flex } from "components/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";

export interface UserStakingProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  poolData: PoolData | undefined | null;
  StakingAndClaim: React.ReactNode;
  userStakingInfo: UserStakingInfo | undefined | null;
  rewardToken: Token | undefined | null;
  stakingToken: Token | undefined | null;
  rewardTokenPrice: string | number | undefined | null;
  stakingTokenPrice: string | number | undefined | null;
  state: STATE | undefined;
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
}: UserStakingProps) {
  const principal = useAccountPrincipalString();
  const ICPPrice = useICPPrice();

  const { result: userStakeTokenBalance } = useTokenBalance(pool?.stakingToken.address, principal);

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

  const stakingAmount = useMemo(() => {
    return parseTokenAmount(userStakingInfo?.amount ?? 0, stakingToken?.decimals).toNumber();
  }, [userStakingInfo, stakingToken]);

  const stakingAmountEquet = useMemo(() => {
    return new BigNumber(stakingAmount).multipliedBy(stakingTokenPrice ?? 0).toNumber();
  }, [rewardTokenPrice, stakingAmount]);

  const pendingReward = useMemo(() => {
    if (!rewardToken || !userStakingInfo?.reward) return 0;
    return parseTokenAmount(userStakingInfo.reward, rewardToken.decimals).toNumber();
  }, [userStakingInfo, rewardToken]);

  const pendingRewardEquet = useMemo(() => {
    return new BigNumber(pendingReward).multipliedBy(rewardTokenPrice ?? 0).toNumber();
  }, [pendingReward, rewardTokenPrice]);

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
            {totalDeposit && rewardToken
              ? `${toSignificantWithGroupSeparator(totalDeposit, 6)} ${rewardToken.symbol}`
              : "--"}
          </Typography>
          <Typography sx={{ textAlign: "right", color: "text.primary", fontWeight: 600 }}>
            {totalDepositUSD ? `~${new BigNumber(totalDepositUSD).toFormat(2)}` : "--"}
          </Typography>
        </Box>
      </Flex>

      <Flex justify="space-between" align="center">
        <Typography>
          <Trans>Wallet Balance</Trans>
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

      <Grid item container xs={12} direction="row" justifyContent="space-between" alignItems="flex-start">
        <Grid item container>
          <Box sx={{ marginBottom: "14px" }}>
            <Typography>
              <Trans>{pool?.rewardTokenSymbol} Earned</Trans>
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          wrap="nowrap"
          spacing={2}
        >
          <Grid item xs={9}>
            <Typography color="text.primary">
              <CountUp
                style={{ fontSize: 24 }}
                preserveValue
                end={pendingReward}
                decimals={4}
                duration={1}
                separator=","
              />
            </Typography>
            <Typography color="text.primary">
              <CountUp
                style={{ fontSize: 14 }}
                preserveValue
                end={pendingRewardEquet}
                decimals={2}
                duration={1}
                separator=","
                prefix="~$"
              />
            </Typography>
          </Grid>
          <Grid item>
            <Harvest rewardToken={rewardToken} reward={pendingReward} pool={pool} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ marginBottom: "14px" }}>
          <Typography fontSize="14px">
            <Trans>Your Stake:</Trans>
          </Typography>
        </Box>

        <Flex justify="space-between" align="center">
          <Box>
            <Typography color="text.primary">
              <CountUp
                style={{ fontSize: 24 }}
                preserveValue
                end={stakingAmount}
                decimals={4}
                duration={1}
                separator=","
              />
            </Typography>
            <Typography color="text.primary">
              <CountUp
                style={{ fontSize: 14 }}
                preserveValue
                end={stakingAmountEquet}
                decimals={2}
                duration={1}
                separator=","
                prefix="~$"
              />
            </Typography>
          </Box>
          <Box>{walletIsConnected ? StakingAndClaim : <ConnectWallet />}</Box>
        </Flex>
      </Grid>
    </Box>
  );
}
