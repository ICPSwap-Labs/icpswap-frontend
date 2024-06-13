import React, { useMemo, useState, useContext, useEffect } from "react";
import { CardActions, CardContent, Link } from "@mui/material";
import { Grid, Box, Collapse, Button, Typography, CircularProgress } from "components/Mui";
import ConnectWallet from "components/authentication/ButtonConnector";
import { MainCard, TokenImage, Flex, Tooltip, Modal, NoData } from "components/index";
import { useIntervalUserRewardInfo, useIntervalUserFarmInfo, useFarmUSDValue } from "hooks/staking-farm";
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
  formatDollarAmount,
} from "@icpswap/utils";
import {
  useV3FarmRewardMetadata,
  useFarmUserPositions,
  useFarmInitArgs,
  useSwapUserPositions,
  useFarmCycles,
  useFarmUserRewards,
  farmWithdraw,
  useSwapPoolMetadata,
  useFarmCycles,
  useFarmUserRewards,
  farmWithdraw,
} from "@icpswap/hooks";
import Countdown from "react-countdown";
import { ICRocksLoadIcon } from "components/Layout/Header/ProfileSection";
import { Theme } from "@mui/material/styles";
import { STATE } from "types/staking-farm";
import { ResultStatus, type FarmTvl } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { Principal } from "@dfinity/principal";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useTips, MessageTypes } from "hooks/useTips";

import FarmContext from "../context";
import OptionStaking from "./OptionStaking";

const useStyle = makeStyles(() => ({
  cardHeader: {
    position: "relative",
    height: "196px",
    background: "rgba(101, 80, 186, 0.18)",
    borderRadius: "4px 4px 0 0",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden",
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

  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [refreshRewardsTrigger, setRefreshRewardsTrigger] = useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [reclaimOpen, setReclaimOpen] = React.useState(false);
  const [openTip] = useTips();

  const { farmId } = useMemo(() => {
    return { farmId: farmTVL[0].toString(), tvl: farmTVL[1] };
  }, [farmTVL]);

  const userFarmInfo = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
  const { result: farmInitArgs } = useFarmInitArgs(farmId);
  const { result: userAllPositions } = useSwapUserPositions(
    userFarmInfo?.pool.toString(),
    principal?.toString(),
    forceUpdate,
  );
  const { result: userStakedPositions } = useFarmUserPositions(farmId, principal?.toString(), forceUpdate);
  const { result: unclaimedRewards } = useFarmUserRewards(farmId, principal, refreshRewardsTrigger);
  const [, token0] = useToken(userFarmInfo?.poolToken0.address) ?? undefined;
  const [, token1] = useToken(userFarmInfo?.poolToken1.address) ?? undefined;
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address) ?? undefined;
  const { result: swapPoolMetadata } = useSwapPoolMetadata(userFarmInfo?.pool.toString());
  const { result: unclaimedRewards } = useFarmUserRewards(farmId, principal, refreshRewardsTrigger);

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions || !farmInitArgs) return undefined;

    if (farmInitArgs.priceInsideLimit === false) {
      return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
    }

    if (!swapPoolMetadata) return undefined;

    return userAllPositions
      .filter((position) => position.liquidity !== BigInt(0))
      .filter((position) => {
        const outOfRange = swapPoolMetadata.tick < position.tickLower || swapPoolMetadata.tick >= position.tickUpper;
        return !outOfRange;
      });
  }, [userAllPositions, farmInitArgs, swapPoolMetadata]);

  const positionIds = useMemo(() => {
    return userStakedPositions?.map((position) => position.positionId) ?? [];
  }, [userStakedPositions]);

  const _userRewardAmount = useIntervalUserRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || !_userRewardAmount) return undefined;

    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));

    return new BigNumber(_userRewardAmount.toString()).multipliedBy(userRewardRatio);
  }, [_userRewardAmount, farmInitArgs]);

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
    if (positionIds !== undefined && state === STATE.LIVE) {
      if (positionIds.length === 0) {
        updateUnStakedFarms(farmId);
      } else {
        deleteUnStakedFarms(farmId);
      }
    }
  }, [positionIds?.length]);

  const { result: farmRewardMetadata } = useV3FarmRewardMetadata(farmId);
  const { result: cycles } = useFarmCycles(farmId);

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

  const handleReclaim = async () => {
    if (withdrawLoading) return;

    setWithdrawLoading(true);

    const { status, message } = await farmWithdraw(farmId);

    if (status === ResultStatus.OK) {
      openTip(t`Withdraw successfully`, MessageTypes.success);
      setRefreshRewardsTrigger(refreshRewardsTrigger + 1);
      setReclaimOpen(false);
    } else {
      openTip(message !== "" ? message : t`Failed to withdraw`, MessageTypes.error);
    }

    setWithdrawLoading(false);
  };

  return (
    <MainCard
      borderRadius="4px"
      level={1}
      padding="0px"
      sx={{
        display:
          stakeOnly && state === STATE.LIVE
            ? userStakedPositions && userStakedPositions.length > 0
              ? "block"
              : "none"
            : "block",
        width: "384px",
        overflow: "hidden",
        height: "fit-content",
        "@media (max-width: 520px)": {
          width: "100%",
        },
      }}
    >
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Grid className={classes.cardHeader}>
          <Box
            sx={{
              width: "212px",
              height: "131px",
              background: "rgba(53, 6, 89, 0.50)",
              filter: "blur(27px)",
              position: "absolute",
              left: "-61px",
              zIndex: 1,
              bottom: "-60px",
            }}
          />

          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              minWidth: "77px",
              height: "30px",
              padding: "6px",
              background: "#654DA9",
              borderRadius: "4px 0 4px 0",
              border: "1px solid #7D5DC1",
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

          <Typography color="text.primary" sx={{ position: "relative", padding: "0 12px", fontWeight: 700, zIndex: 1 }}>
            Stake {token0?.symbol}/{token1?.symbol} position to earn {rewardToken?.symbol}
          </Typography>
        </Grid>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0", padding: "24px" }}>
          <Flex justify="space-between">
            <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
              <Typography fontWeight={600}>
                <Trans>APR</Trans>
              </Typography>

              <Tooltip
                iconSize="14px"
                tips={t`The current APR is calculated as an average based on the latest distribution rewards data. The actual returns from staked positions depend on the concentration of the selected price range, the staking duration, and the number of tokens staked.`}
              />
            </Box>

            <Typography color="text.primary" fontWeight={600}>
              {apr ?? "--"}
            </Typography>
          </Flex>

          <Flex justify="space-between">
            <Typography fontWeight={600}>
              <Trans>Total Reward Amount</Trans>
            </Typography>
            <Typography color="text.primary" fontWeight={600}>
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
            <Typography fontWeight={600}>
              <Trans>Total Value Staked</Trans>
            </Typography>
            <Typography color="text.primary" fontWeight={600}>
              {poolTvl ? `${formatDollarAmount(poolTvl)}` : "--"}
            </Typography>
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
              <Typography sx={{ flex: 1, fontWeight: 500, fontSize: "16px" }}>
                {Number(positionIds.length ?? 0)}
              </Typography>
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
              <Typography color="text.primary">{userTvl ? `${formatDollarAmount(userTvl)}` : "--"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <CardActions disableSpacing style={{ paddingTop: 0 }}>
          <Grid container justifyContent="center">
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#648EFB",
                cursor: "pointer",
              }}
              onClick={handleExpandClick}
            >
              {expanded ? t`Hide` : t`Details`}
            </Typography>
          </Grid>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ paddingTop: 0 }} className={classes.collapseContent}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0", maxWidth: 400, paddingTop: "24px" }}>
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
                <Typography color="text.primary">{timestampFormat(Number(userFarmInfo?.startTime) * 1000)}</Typography>
              </Grid>

              <Grid container justifyContent="space-between" alignItems="flex-start">
                <Typography>{state === STATE.NOT_STARTED ? <Trans>Left</Trans> : <Trans>End In</Trans>}</Typography>
                <Typography color="text.primary" component="div">
                  <CountdownBox startTime={Number(userFarmInfo?.startTime)} endTime={Number(userFarmInfo?.endTime)} />
                </Typography>
              </Grid>

              <Flex justify="space-between">
                <Typography>
                  <Trans>Token0 minimum amount</Trans>
                </Typography>
                <Typography color="text.primary" component="div">
                  {farmInitArgs && token0
                    ? `${toSignificantWithGroupSeparator(
                        parseTokenAmount(farmInitArgs.token0AmountLimit.toString(), token0.decimals).toString(),
                      )} ${token0.symbol}`
                    : "--"}
                </Typography>
              </Flex>

              <Flex justify="space-between">
                <Typography>
                  <Trans>Token1 minimum amount</Trans>
                </Typography>
                <Typography color="text.primary" component="div">
                  {farmInitArgs && token1
                    ? `${toSignificantWithGroupSeparator(
                        parseTokenAmount(farmInitArgs.token1AmountLimit.toString(), token1.decimals).toString(),
                      )} ${token1.symbol}`
                    : "--"}
                </Typography>
              </Flex>

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

              <Flex justify="space-between">
                <Typography
                  sx={{ cursor: "pointer" }}
                  color="text.theme-secondary"
                  onClick={() => setReclaimOpen(true)}
                >
                  <Trans>Reclaim</Trans>
                </Typography>

                <Typography color="text.primary">
                  <Link href={`${INFO_URL}/farm/details/${farmId}`} target="_blank">
                    <Trans>Farm Info</Trans>
                  </Link>
                </Typography>
              </Flex>
            </Box>
          </CardContent>
        </Collapse>
      </Box>

      <Modal open={reclaimOpen} title="Reclaim" onClose={() => setReclaimOpen(false)}>
        {unclaimedRewards && unclaimedRewards > BigInt(0) ? (
          <Flex justify="space-between">
            <Flex gap="0 12px">
              <TokenImage tokenId={rewardToken?.address} logo={rewardToken?.logo} size="32px" />
              <Typography color="text.primary">
                {rewardToken
                  ? `${parseTokenAmount(unclaimedRewards, rewardToken.decimals).toFormat()} ${rewardToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>
            <Button
              variant="contained"
              size="small"
              onClick={handleReclaim}
              disabled={withdrawLoading}
              startIcon={withdrawLoading ? <CircularProgress color="inherit" size={20} /> : null}
            >
              <Trans>Reclaim</Trans>
            </Button>
          </Flex>
        ) : (
          <NoData />
        )}
      </Modal>
    </MainCard>
  );
}
