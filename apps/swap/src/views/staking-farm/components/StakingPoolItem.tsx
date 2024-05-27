import React, { useMemo, useState, useContext, useEffect } from "react";
import { Grid, CardActions, CardContent, Collapse, Typography, Link, Box } from "@mui/material";
import ConnectWallet from "components/authentication/ButtonConnector";
import { MainCard, TokenImage, Flex, Tooltip } from "components/index";
import {
  useIntervalUserRewardInfo,
  useIntervalUserFarmInfo,
  useV3StakingCycles,
  useFarmUSDValue,
} from "hooks/staking-farm";
import CountUp from "react-countup";
import { makeStyles, useTheme } from "@mui/styles";
import { useToken } from "hooks/useCurrency";
import { INFO_URL, AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal, useConnectorStateConnected } from "store/auth/hooks";
import { t, Trans } from "@lingui/macro";
import {
  parseTokenAmount,
  toSignificantWithGroupSeparator,
  cycleValueFormat,
  shorten,
  timestampFormat,
  explorerLink,
  BigNumber,
} from "@icpswap/utils";
import { useV3FarmRewardMetadata, useFarmUserPositions, useFarmInitArgs, useSwapUserPositions } from "@icpswap/hooks";
import Countdown from "react-countdown";
import { ICRocksLoadIcon } from "components/Layout/Header/ProfileSection";
import { Theme } from "@mui/material/styles";
import { STATE } from "types/staking-farm";
import type { FarmTvl } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { Principal } from "@dfinity/principal";
import { useUSDPrice } from "hooks/useUSDPrice";

import FarmContext from "../context";
import OptionStaking from "./OptionStaking";

const useStyle = makeStyles(() => ({
  cardHeader: {
    height: "196px",
    background: "rgba(101, 80, 186, 0.18)",
    borderRadius: "4px 4px 0 0",
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  headerImage: {
    marginTop: "50px",
    marginBottom: "26px",
    position: "relative",
    "& .poolImageBox": {
      marginTop: "-34px",
      marginBottom: "16px",
      marginLeft: "-10px",
      left: "50px",
      position: "absolute",
    },
  },
  collapseContent: {
    padding: 0,
    width: "calc(100% - 48px)",
    margin: "0 auto",
    borderTop: "1px solid #313A5A",
  },
}));

const CountdownBox = ({ startTime, endTime }: { startTime: number; endTime: number }) => {
  const nowTime = parseInt(String(Date.now() / 1000));
  let expand = false;
  let date = startTime;
  if (nowTime > endTime) {
    expand = true;
  }
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

export type FarmPoolProps = { stakeOnly: boolean; state: STATE; farmTVL: [Principal, FarmTvl] };

export default function FarmPool({ farmTVL, state, stakeOnly }: FarmPoolProps) {
  const classes = useStyle();
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();

  const [expanded, setExpanded] = React.useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const { farmId } = useMemo(() => {
    return { farmId: farmTVL[0].toString(), tvl: farmTVL[1] };
  }, [farmTVL]);

  const userFarmInfo = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);

  const { result: userAllPositions } = useSwapUserPositions(
    userFarmInfo?.pool.toString(),
    principal?.toString(),
    forceUpdate,
  );
  const { result: userStakedPositions } = useFarmUserPositions(farmId, principal?.toString(), forceUpdate);

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions) return undefined;
    return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
  }, [userAllPositions]);

  const positionIds = useMemo(() => {
    return userStakedPositions?.map((position) => position.positionId) ?? [];
  }, [userStakedPositions]);

  const { result: farmInitArgs } = useFarmInitArgs(farmId);

  const _userRewardAmount = useIntervalUserRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || !_userRewardAmount) return undefined;

    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));

    return new BigNumber(_userRewardAmount.toString()).multipliedBy(userRewardRatio);
  }, [_userRewardAmount, farmInitArgs]);

  const [, token0] = useToken(userFarmInfo?.poolToken0.address) ?? undefined;
  const [, token1] = useToken(userFarmInfo?.poolToken1.address) ?? undefined;
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address) ?? undefined;

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const { poolTvl, userTvl, userRewardUSD, parsedUserRewardAmount } = useFarmUSDValue({
    token0,
    token1,
    rewardToken,
    userRewardAmount,
    userFarmInfo,
    farmId,
    rewardTokenPrice,
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleGoToGetPosition = () => {
    window.open(`/liquidity/add/${userFarmInfo?.poolToken0.address}/${userFarmInfo?.poolToken1.address}`, "_target");
  };

  const walletIsConnected = useConnectorStateConnected();

  const { updateUnStakedFarms, deleteUnStakedFarms } = useContext(FarmContext);

  useEffect(() => {
    if (positionIds !== undefined) {
      if (positionIds.length === 0) {
        updateUnStakedFarms(farmId);
      } else {
        deleteUnStakedFarms(farmId);
      }
    }
  }, [positionIds?.length]);

  const { result: farmRewardMetadata } = useV3FarmRewardMetadata(farmId);
  const { result: cycles } = useV3StakingCycles(farmId);

  // (Reward token amount each cycles * reward token price / Total valued staked ) * (3600*24*360/seconds each cycle) *100%
  const apr = useMemo(() => {
    if (!poolTvl) return undefined;

    if (
      !rewardTokenPrice ||
      !farmInitArgs ||
      !farmRewardMetadata ||
      !rewardToken ||
      new BigNumber(poolTvl).isEqualTo(0)
    )
      return undefined;

    if (state !== STATE.LIVE) return undefined;

    const val = parseTokenAmount(farmRewardMetadata.rewardPerCycle, rewardToken.decimals)
      .multipliedBy(rewardTokenPrice)
      .dividedBy(poolTvl)
      .multipliedBy(new BigNumber(3600 * 24 * 360).dividedBy(farmInitArgs.secondPerCycle.toString()))
      .multipliedBy(100)
      .toFixed(2);

    return `${val}%`;
  }, [poolTvl, state, rewardTokenPrice, farmInitArgs, farmRewardMetadata, rewardToken]);

  return (
    <Box>
      <MainCard
        level={1}
        padding="0px"
        sx={{
          display: stakeOnly && userStakedPositions?.length === 0 ? "none" : "block",
          width: "384px",
          overflow: "hidden",
          height: "fit-content",
          "@media (max-width: 520px)": {
            width: "340px",
          },
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <Grid className={classes.cardHeader}>
            <Typography
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                minWidth: "77px",
                height: "30px",
                padding: "6px",
                background: "#654DA9",
                borderRadius: "4px 0 4px 0",
                textAlign: "center",
                border: "1px solid #654DA9",
                color: theme.palette.mode === "dark" ? theme.colors.darkTextPrimary : theme.colors.primaryMain,
              }}
            >
              {state === STATE.NOT_STARTED ? upperFirst(t`Unstart`) : upperFirst(state)}
            </Typography>

            <Grid item className={classes.headerImage}>
              <TokenImage size="80px" logo={rewardToken?.logo} tokenId={rewardToken?.address} />

              <Grid container className="poolImageBox">
                <Box sx={{ display: "flex" }}>
                  <TokenImage size="44px" logo={token0?.logo} tokenId={token0?.address} />
                  <TokenImage size="44px" logo={token1?.logo} tokenId={token1?.address} />
                </Box>
              </Grid>
            </Grid>

            <Grid>
              <Grid item>
                <Typography color="text.primary" sx={{ padding: "0 12px" }}>
                  Stake {token0?.symbol}/{token1?.symbol} position to earn {rewardToken?.symbol}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0", padding: "24px" }}>
            <Flex justify="space-between">
              <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
                <Typography>
                  <Trans>APR</Trans>
                </Typography>

                <Tooltip
                  iconSize="14px"
                  tips={t`The current APR is calculated as an average based on the latest distribution rewards data. The actual returns from staked positions depend on the concentration of the selected price range, the staking duration, and the number of tokens staked.`}
                />
              </Box>

              <Typography color="text.primary">{apr ?? "--"}</Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>
                <Trans>Total Reward Amount</Trans>
              </Typography>
              <Typography color="text.primary">
                {userFarmInfo && rewardToken ? (
                  <>
                    <CountUp
                      preserveValue
                      end={parseTokenAmount(userFarmInfo.totalReward, rewardToken.decimals).toNumber()}
                      decimals={2}
                      duration={1}
                      separator=","
                    />
                    &nbsp;{rewardToken.symbol}
                  </>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>
                <Trans>Total Value Staked</Trans>
              </Typography>
              <Typography color="text.primary">{poolTvl ? `$${poolTvl}` : "--"}</Typography>
            </Flex>

            <Flex justify="space-between" align="flex-start">
              <Typography>
                <Trans>Earned</Trans>
                &nbsp;
                {rewardToken?.symbol}
              </Typography>

              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  <CountUp preserveValue end={parsedUserRewardAmount ?? 0} decimals={6} duration={1} separator="," />
                </Typography>
                <Typography color="text.primary">
                  <CountUp preserveValue end={userRewardUSD ?? 0} decimals={2} duration={1} separator="," prefix="~$" />
                </Typography>
              </Flex>
            </Flex>

            <Flex justify="space-between" align="flex-start">
              <Typography>
                <Trans>Your Available Positions</Trans>
              </Typography>

              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {userAvailablePositions ? userAvailablePositions.length : "--"}
                </Typography>
              </Flex>
            </Flex>

            <Box>
              <Typography mb="14px">
                <Trans>Position Staked</Trans>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  height: "44px",
                  lineHeight: "42px",
                  background: "#111936",
                  border: "1px solid #29314F",
                  borderRadius: "8px",
                  padding: "0 14px",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ flex: 1 }}>{Number(positionIds.length ?? 0)}</Typography>
                {walletIsConnected ? (
                  userFarmInfo ? (
                    <OptionStaking
                      userFarmInfo={userFarmInfo}
                      resetData={() => setForceUpdate(!forceUpdate)}
                      userStakedPositions={userStakedPositions ?? []}
                      farmId={farmId}
                    />
                  ) : null
                ) : (
                  <ConnectWallet />
                )}
              </Box>
            </Box>

            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Grid item>
                <Typography>
                  <Trans>Your Total Value Staked</Trans>
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="text.primary">{userTvl ? `$${userTvl}` : "--"}</Typography>
              </Grid>
            </Grid>
          </Box>

          <CardActions disableSpacing style={{ paddingTop: 0 }}>
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
                {expanded ? t`Hide` : t`Details`}
              </Typography>
            </Grid>
          </CardActions>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{ paddingTop: 0 }} className={classes.collapseContent}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0", maxWidth: 400, paddingTop: "24px" }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography sx={{ cursor: "pointer", textDecoration: "underline" }} onClick={handleGoToGetPosition}>
                      Get {token0?.symbol}/{token1?.symbol} position
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
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Total number of staked positions</Trans>
                  </Typography>
                  <Typography color="text.primary">{(userFarmInfo?.numberOfStakes ?? 0).toString()}</Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Claimed Rewards</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {!farmRewardMetadata || !rewardToken
                      ? "--"
                      : `${toSignificantWithGroupSeparator(
                          parseTokenAmount(
                            farmRewardMetadata.totalRewardHarvested.toString(),
                            rewardToken.decimals,
                          ).toString(),
                          8,
                        )} ${rewardToken.symbol}`}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Unclaimed Rewards</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {!farmRewardMetadata || !rewardToken
                      ? "--"
                      : `${toSignificantWithGroupSeparator(
                          parseTokenAmount(
                            farmRewardMetadata.totalRewardUnharvested.toString(),
                            rewardToken.decimals,
                          ).toString(),
                          8,
                        )} ${rewardToken.symbol}`}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Distribution Interval</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {Number(farmRewardMetadata?.secondPerCycle ?? 0) / 60} <Trans>min</Trans>
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Amount per Distribution</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {farmRewardMetadata && rewardToken
                      ? `${toSignificantWithGroupSeparator(
                          parseTokenAmount(farmRewardMetadata.rewardPerCycle, rewardToken.decimals).toString(),
                          8,
                        )} ${rewardToken.symbol}`
                      : "--"}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Starting At</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {timestampFormat(Number(userFarmInfo?.startTime) * 1000)}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>{state === STATE.NOT_STARTED ? <Trans>Left</Trans> : <Trans>End In</Trans>}</Typography>
                  <Typography color="text.primary" component="div">
                    <CountdownBox startTime={Number(userFarmInfo?.startTime)} endTime={Number(userFarmInfo?.endTime)} />
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Creator</Trans>
                  </Typography>
                  <Typography color="text.primary.main">
                    {userFarmInfo ? (
                      <Link href={explorerLink(userFarmInfo.creator.toString())} target="_blank">
                        {shorten(userFarmInfo?.creator.toString())}
                      </Link>
                    ) : (
                      "--"
                    )}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Canister ID</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    <Link href={explorerLink(farmId)} target="_blank">
                      {shorten(farmId)}
                    </Link>
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Cycles Left</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}
                  </Typography>
                </Grid>

                <Grid item container justifyContent="flex-end">
                  <Typography color="text.primary">
                    <Link href={`${INFO_URL}/farm/details/${farmId}`} target="_blank">
                      <Trans>Farm Info</Trans>
                    </Link>
                  </Typography>
                </Grid>
              </Box>
            </CardContent>
          </Collapse>
        </Box>
      </MainCard>
    </Box>
  );
}
