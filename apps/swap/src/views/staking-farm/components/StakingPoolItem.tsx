import React, { useMemo, useState, useContext, useEffect } from "react";
import { Grid, CardActions, CardContent, Collapse, Typography, Link, Box } from "@mui/material";
import ConnectWallet from "components/authentication/ButtonConnector";
import { MainCard, TokenImage } from "components/index";
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
  toSignificant,
  cycleValueFormat,
  shorten,
  timestampFormat,
  explorerLink,
} from "@icpswap/utils";
import { useV3FarmMetadata, useFarmUserPositions } from "@icpswap/hooks";
import Countdown from "react-countdown";
import { ICRocksLoadIcon } from "components/Layout/Header/ProfileSection";
import { Theme } from "@mui/material/styles";
import { STATE } from "types/staking-farm";
import type { FarmTvl } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { Principal } from "@dfinity/principal";

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

  const { result: userAllPositions } = useFarmUserPositions(farmId, principal?.toString(), forceUpdate);

  const positionIds = useMemo(() => {
    return userAllPositions?.map((position) => position.positionId) ?? [];
  }, [userAllPositions]);

  const userRewardAmount = useIntervalUserRewardInfo(farmId, positionIds);

  const [, token0] = useToken(userFarmInfo?.poolToken0.address) ?? undefined;
  const [, token1] = useToken(userFarmInfo?.poolToken1.address) ?? undefined;

  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address) ?? undefined;

  const { poolTVL, userTVL, userRewardUSD, parsedUserRewardAmount } = useFarmUSDValue({
    token0,
    token1,
    rewardToken,
    userRewardAmount,
    userFarmInfo,
    farmId,
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleGoToGetPosition = () => {
    window.open(
      `/swap/liquidity/add/${userFarmInfo?.poolToken0.address}/${userFarmInfo?.poolToken1.address}`,
      "_target",
    );
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

  const { result: farmMetadata } = useV3FarmMetadata(farmId);
  const { result: cycles } = useV3StakingCycles(farmId);

  return (
    <Box>
      <MainCard
        level={1}
        padding="0px"
        sx={{
          display: stakeOnly && userAllPositions?.length === 0 ? "none" : "block",
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
                  Stake {token0?.symbol}/{token1?.symbol} position(LP) to earn {rewardToken?.symbol}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0", padding: "24px" }}>
            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Typography>
                <Trans>Total Reward Amount</Trans>
              </Typography>
              <Box sx={{ flex: "1", display: "flex", justifyContent: "flex-end" }}>
                <CountUp
                  preserveValue
                  end={parseTokenAmount(
                    userFarmInfo?.totalReward ?? userFarmInfo?.totalRewardUnclaimed,
                    rewardToken?.decimals,
                  ).toNumber()}
                  decimals={2}
                  duration={1}
                  separator=","
                />
              </Box>
            </Grid>

            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Typography>
                <Trans>Total Value Staked</Trans>
              </Typography>
              <Typography color="text.primary">${poolTVL}</Typography>
            </Grid>

            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Typography>
                <Trans>Earned</Trans>
                &nbsp;
                {rewardToken?.symbol}
              </Typography>

              <Grid item>
                <Grid container direction="column" justifyContent="flex-end">
                  <CountUp preserveValue end={parsedUserRewardAmount ?? 0} decimals={6} duration={1} separator="," />
                  <CountUp
                    style={{ fontSize: 14, textAlign: "right", display: "block" }}
                    preserveValue
                    end={userRewardUSD ?? 0}
                    decimals={2}
                    duration={1}
                    separator=","
                    prefix="~$"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Box>
              <Typography mb="14px">
                <Trans>Position(LP) Staked</Trans>
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
                  userFarmInfo && userAllPositions ? (
                    <OptionStaking
                      userFarmInfo={userFarmInfo}
                      resetData={() => setForceUpdate(!forceUpdate)}
                      userAllPositions={userAllPositions}
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
                <Typography color="text.primary">${userTVL}</Typography>
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
                      Get {token0?.symbol}/{token1?.symbol} position(LP)
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
                    {toSignificant(
                      parseTokenAmount(
                        farmMetadata?.totalRewardClaimed?.toString() ?? 0,
                        rewardToken?.decimals,
                      ).toString(),
                      8,
                      { groupSeparator: "," },
                    )}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Unclaimed Rewards</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {toSignificant(
                      parseTokenAmount(
                        farmMetadata?.totalRewardUnclaimed?.toString() ?? 0,
                        rewardToken?.decimals,
                      ).toString(),
                      8,
                      { groupSeparator: "," },
                    )}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Distribution Interval</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {Number(farmMetadata?.secondPerCycle ?? 0) / 60} <Trans>min</Trans>
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Amount per Distribution</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {toSignificant(
                      parseTokenAmount(farmMetadata?.rewardPerCycle, rewardToken?.decimals).toString(),
                      8,
                      { groupSeparator: "," },
                    )}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Starting at</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {timestampFormat(Number(userFarmInfo?.startTime) * 1000)}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>{state === STATE.NOT_STARTED ? <Trans>Left</Trans> : <Trans>End in</Trans>}</Typography>
                  <Typography color="text.primary" component="div">
                    <CountdownBox startTime={Number(userFarmInfo?.startTime)} endTime={Number(userFarmInfo?.endTime)} />
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Created by</Trans>
                  </Typography>
                  <Typography color="text.primary.main">
                    <Link href={`https://icscan.io/principal/${userFarmInfo?.creator.toString()}`} target="_blank">
                      {shorten(userFarmInfo?.creator.toString())}
                    </Link>
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Incentive pool Id</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    <Link href={explorerLink(farmId)} target="_blank">
                      {shorten(farmId)}
                    </Link>
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Typography>
                    <Trans>Cycles left</Trans>
                  </Typography>
                  <Typography color="text.primary">
                    {cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}
                  </Typography>
                </Grid>

                <Grid item container justifyContent="flex-end">
                  <Typography color="text.primary">
                    <Link href={`${INFO_URL}/staking-farm/details/${farmId}`} target="_blank">
                      <Trans>Farms Info</Trans>
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
