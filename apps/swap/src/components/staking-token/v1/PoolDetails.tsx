import React, { useMemo } from "react";
import { Grid, Box, Collapse, Typography, Link } from "@mui/material";
import { INFO_URL } from "constants/index";
import { WRAPPED_ICP } from "constants/tokens";
import { useV1StakingTokenPool, useV1StakingTokenCycles } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useTheme } from "@mui/styles";
import { Trans } from "@lingui/macro";
import Countdown from "react-countdown";
import { ICRocksLoadIcon } from "components/Layout/Header/ProfileSection";
import { Theme } from "@mui/material/styles";
import { StakingPoolControllerPoolInfo, STATE, PoolData } from "types/staking-token-v1";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { shorten, timestampFormat, parseTokenAmount, cycleValueFormat, explorerLink } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";

const CountdownBox = ({ startTime, endTime }: { startTime: number; endTime: number }) => {
  const nowTime = parseInt(String(Date.now() / 1000));
  let expand = false;
  let date = startTime;

  if (nowTime > endTime) expand = true;

  if (nowTime < startTime) {
    date = startTime * 1000;
  } else if (nowTime > startTime && nowTime < endTime) {
    date = endTime * 1000;
  } else {
    date = 0;
  }

  return expand ? (
    <Typography color="text.primary">
      <Trans>End</Trans>
    </Typography>
  ) : (
    <Countdown date={date} />
  );
};

export interface StakingPoolDetailsProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  state: STATE;
  poolData: PoolData | undefined;
  rewardToken: Token | undefined;
  stakingToken: Token | undefined;
  rewardTokenPrice: string | number | undefined;
  stakingTokenPrice: string | number | undefined;
}

export default function StakingPoolDetails({
  pool,
  state,
  poolData,
  rewardToken,
  rewardTokenPrice,
  stakingTokenPrice,
}: StakingPoolDetailsProps) {
  const theme = useTheme() as Theme;

  const [expanded, setExpanded] = React.useState(false);

  const { result: poolTokenBalance } = useTokenBalance(pool?.stakingToken.address, pool?.canisterId);

  const poolUSDValue = useMemo(() => {
    if (!pool || !poolTokenBalance || (poolTokenBalance && isNaN(poolTokenBalance.toNumber()))) return "0";
    return parseTokenAmount(poolTokenBalance, pool.stakingTokenDecimals)
      .multipliedBy(stakingTokenPrice ?? 0)
      .toNumber();
  }, [poolTokenBalance, stakingTokenPrice]);

  const { result: stakingTokenPoolInfo } = useV1StakingTokenPool(pool?.canisterId);

  const totalRewardDeposit = useMemo(() => {
    if (!rewardToken || !poolData) return 0;
    return parseTokenAmount(poolData.rewardDebt, rewardToken.decimals).toNumber();
  }, [poolData?.rewardDebt, rewardToken]);

  const totalRewardUSDValue = useMemo(() => {
    return new BigNumber(totalRewardDeposit).multipliedBy(rewardTokenPrice ?? 0).toNumber();
  }, [totalRewardDeposit, rewardTokenPrice]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleGetToken = () => {
    if (pool?.stakingToken.address === WRAPPED_ICP.address) {
      window.open(`/swap/?input=${ICP.address}`, "_target");
    } else {
      window.open(`/swap/?input=${ICP.address}&output=${pool?.stakingToken.address}`, "_target");
    }
  };

  const { result: cycles } = useV1StakingTokenCycles(pool?.canisterId);

  return (
    <>
      <Box sx={{ padding: "0 0 20px 0", background: theme.palette.background.level1 }}>
        <Grid container justifyContent="center" onClick={handleExpandClick}>
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "14px",
              lineHeight: "24px",
              textAlign: "center",
              color: "#648EFB",
              cursor: "pointer",
            }}
          >
            {expanded ? "Hide" : "Details"}
          </Typography>
        </Grid>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          style={{ padding: "24px 24px", borderTop: "1px solid #313A5A", background: theme.palette.background.level1 }}
        >
          <Box sx={{ display: "grid", gap: "24px 0" }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ cursor: "pointer" }} onClick={handleGetToken}>
                Get {pool?.stakingTokenSymbol}
                <ICRocksLoadIcon
                  fontSize="24"
                  sx={{
                    position: "relative",
                    top: "3px",
                    cursor: "pointer",
                    marginLeft: "5px",
                    color: theme.colors.secondaryMain,
                  }}
                />
              </Typography>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>
                  <Trans>Pool Balance</Trans>
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {parseTokenAmount(poolTokenBalance ?? 0, pool?.stakingTokenDecimals).toFormat()}{" "}
                  {pool?.stakingTokenSymbol}
                </Typography>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  ~${new BigNumber(poolUSDValue ?? 0).toFormat(2)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>
                  <Trans>Total Rewards</Trans>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {new BigNumber(totalRewardDeposit ?? 0).toFormat()} {pool?.rewardTokenSymbol}
                </Typography>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  ~${new BigNumber(totalRewardUSDValue ?? 0).toFormat(2)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>
                  <Trans>Reward Per Second</Trans>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {stakingTokenPoolInfo && rewardToken
                    ? parseTokenAmount(
                        new BigNumber(stakingTokenPoolInfo.rewardPerTime.toString()).multipliedBy(
                          stakingTokenPoolInfo.BONUS_MULTIPLIER.toString(),
                        ),
                        rewardToken.decimals,
                      ).toFormat()
                    : "--"}
                  &nbsp;
                  {pool?.rewardTokenSymbol}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>
                  <Trans>Starting at</Trans>
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary">
                  {pool?.startTime ? timestampFormat(Number(pool.startTime) * 1000) : "--"}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>{state === STATE.UPCOMING ? <Trans>Left</Trans> : <Trans>End in</Trans>}</Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary" component="div">
                  <CountdownBox
                    startTime={Number(poolData?.lastRewardTime ?? 0)}
                    endTime={Number(poolData?.bonusEndTime ?? 0)}
                  />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>Created by</Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary.main">
                  <Link href={`https://icscan.io/principal/${pool?.creator}`} target="_blank">
                    {pool?.creator ? shorten(pool?.creator) : "--"}
                  </Link>
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>Canister ID</Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary">
                  {pool ? (
                    <Link href={explorerLink(pool.canisterId)} target="_blank">
                      {pool?.canisterId ? shorten(pool?.canisterId) : "--"}
                    </Link>
                  ) : null}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>Cycles left</Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary">{cycles ? cycleValueFormat(cycles) : "--"}</Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-end">
              <Typography color="text.primary">
                <Link href={`${INFO_URL}/stake/v1/details/${pool?.canisterId}/${state}`} target="_blank">
                  Token Pools Info
                </Link>
              </Typography>
            </Grid>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
