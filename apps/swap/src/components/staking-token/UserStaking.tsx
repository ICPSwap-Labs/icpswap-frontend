import React, { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import CountUp from "react-countup";
import { Trans } from "@lingui/macro";
import { useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/authentication/ButtonConnector";
import { useICPPrice } from "store/global/hooks";
import { PoolData } from "types/staking-token";
import { UserStakingInfo } from "types/staking-token";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import Harvest from "components/staking-token/Harvest";
import { STATE } from "types/staking-token";

export interface UserStakingProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  poolData: PoolData | undefined | null;
  StakingAndClaim: React.ReactNode;
  userStakingInfo: UserStakingInfo | undefined | null;
  rewardToken: Token | undefined | null;
  stakingToken: Token | undefined | null;
  rewardTokenPrice: string | number | undefined | null;
  stakingTokenPrice: string | number | undefined | null;
  state: STATE;
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
  const ICPPrice = useICPPrice();

  const apr = useMemo(() => {
    if (poolData?.BONUS_MULTIPLIER && poolData?.rewardPerTime && stakingToken && rewardToken) {
      const poolInfoPerSecond = Number(poolData.BONUS_MULTIPLIER * poolData.rewardPerTime);
      const totalDeposit = parseTokenAmount(poolData.totalDeposit, stakingToken.decimals).toNumber();
      if (ICPPrice && rewardTokenPrice && stakingTokenPrice && rewardToken.decimals && poolInfoPerSecond > 0) {
        const perSecond = parseTokenAmount(poolInfoPerSecond, rewardToken.decimals).toNumber();
        //apr={(perSecond*3600*24*365)/ totalDeposit} * 100
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
  }, [ICPPrice, poolData, rewardToken, rewardTokenPrice, stakingTokenPrice, stakingToken]);

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
    <Box sx={{ padding: "24px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Box sx={{ marginBottom: "14px" }}>
                <Typography fontSize="14px">
                  <Trans>APR:</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent={"flex-end"}>
                {state === STATE.FINISHED ? (
                  "--"
                ) : (
                  <CountUp preserveValue={true} end={apr} decimals={2} duration={1} suffix="%" separator="," />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} direction="row" justifyContent="space-between" alignItems="flex-start">
          <Grid item container>
            <Box sx={{ marginBottom: "14px" }}>
              <Typography fontSize="14px">
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
              <Box>
                <CountUp
                  style={{ fontSize: 24 }}
                  preserveValue={true}
                  end={pendingReward}
                  decimals={4}
                  duration={1}
                  separator=","
                />
              </Box>
              <Box>
                <CountUp
                  style={{ fontSize: 14 }}
                  preserveValue={true}
                  end={pendingRewardEquet}
                  decimals={2}
                  duration={1}
                  separator=","
                  prefix="~$"
                />
              </Box>
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
          <Grid>
            <Grid container>
              <Grid item xs={6}>
                <Box>
                  <CountUp
                    style={{ fontSize: 24 }}
                    preserveValue={true}
                    end={stakingAmount}
                    decimals={4}
                    duration={1}
                    separator=","
                  />
                </Box>
                <Box>
                  <CountUp
                    style={{ fontSize: 14 }}
                    preserveValue={true}
                    end={stakingAmountEquet}
                    decimals={2}
                    duration={1}
                    separator=","
                    prefix="~$"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent={"flex-end"}>
                  {walletIsConnected ? StakingAndClaim : <ConnectWallet />}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
