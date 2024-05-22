import React, { useMemo } from "react";
import { Grid, Box, Collapse, Typography, Link } from "@mui/material";
import { INFO_URL } from "constants/index";
import { WRAPPED_ICP, ICP } from "constants/tokens";
import { useStakingTokenPool, useStakingPoolCycles } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useTheme } from "@mui/styles";
import { Trans } from "@lingui/macro";
import Countdown from "react-countdown";
import { ICRocksLoadIcon } from "components/Layout/Header/ProfileSection";
import { Flex } from "components/index";
import { Theme } from "@mui/material/styles";
import { STATE, PoolData } from "types/staking-token";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { shorten, timestampFormat, parseTokenAmount, cycleValueFormat, explorerLink } from "@icpswap/utils";

interface CountdownBoxProps {
  startTime: number;
  endTime: number;
}

const CountdownBox = ({ startTime, endTime }: CountdownBoxProps) => {
  const nowTime = parseInt(String(Date.now() / 1000));
  let ended = false;
  let date = startTime;

  if (nowTime > endTime) ended = true;

  if (nowTime < startTime) {
    date = startTime * 1000;
  } else if (nowTime > startTime && nowTime < endTime) {
    date = endTime * 1000;
  } else {
    date = 0;
  }

  return ended ? (
    <Typography color="text.primary">
      <Trans>End</Trans>
    </Typography>
  ) : (
    <Countdown date={date} />
  );
};

export interface StakingPoolDetailsProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  state: STATE | undefined;
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

  // const totalStakingDeposit = useMemo(() => {
  //   if (!poolData || !stakingToken) return 0;
  //   return parseTokenAmount(poolData.totalDeposit, stakingToken.decimals).toNumber();
  // }, [poolData?.totalDeposit, stakingToken]);

  // const totalStakingUSDValue = useMemo(() => {
  //   return new BigNumber(totalStakingDeposit).multipliedBy(stakingTokenPrice ?? 0).toNumber();
  // }, [totalStakingDeposit, stakingTokenPrice]);

  const { result: stakingPoolInfo } = useStakingTokenPool(pool?.canisterId.toString());

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

  const { result: cycles } = useStakingPoolCycles(pool?.canisterId.toString());

  return (
    <>
      <Box sx={{ padding: "0 0 20px 0", background: theme.palette.background.level1 }}>
        <Grid container justifyContent="center" onClick={handleExpandClick}>
          <Typography
            sx={{
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

            <Flex justify="space-between" align="flex-start">
              <Typography>
                <Trans>Pool Balance</Trans>
              </Typography>
              <Box>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {parseTokenAmount(poolTokenBalance ?? 0, pool?.stakingTokenDecimals).toFormat()}{" "}
                  {pool?.stakingTokenSymbol}
                </Typography>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  ~${new BigNumber(poolUSDValue ?? 0).toFormat(2)}
                </Typography>
              </Box>
            </Flex>

            <Flex justify="space-between" align="flex-start">
              <Typography>
                <Trans>Total Rewards</Trans>
              </Typography>

              <Box>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {new BigNumber(totalRewardDeposit ?? 0).toFormat()} {pool?.rewardTokenSymbol}
                </Typography>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  ~${new BigNumber(totalRewardUSDValue ?? 0).toFormat(2)}
                </Typography>
              </Box>
            </Flex>

            <Flex justify="space-between" align="flex-start">
              <Typography>
                <Trans>Reward Per Second</Trans>
              </Typography>

              <Box>
                <Typography color="text.primary" style={{ textAlign: "right" }}>
                  {stakingPoolInfo && rewardToken
                    ? parseTokenAmount(stakingPoolInfo.rewardPerTime.toString(), rewardToken.decimals).toFormat()
                    : "--"}
                  &nbsp;
                  {pool?.rewardTokenSymbol}
                </Typography>
              </Box>
            </Flex>

            <Flex align="flex-start" justify="space-between">
              <Typography>
                <Trans>Starting At</Trans>
              </Typography>

              <Box>
                <Typography color="text.primary">
                  {pool?.startTime ? timestampFormat(Number(pool.startTime) * 1000) : "--"}
                </Typography>
              </Box>
            </Flex>

            <Flex justify="space-between">
              <Typography>{state === STATE.UPCOMING ? <Trans>Left</Trans> : <Trans>End In</Trans>}</Typography>
              <Typography color="text.primary" component="div">
                <CountdownBox startTime={Number(pool?.startTime ?? 0)} endTime={Number(poolData?.bonusEndTime ?? 0)} />
              </Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>
                <Trans>Last Reward Time</Trans>
              </Typography>
              <Typography color="text.primary">
                {stakingPoolInfo?.lastRewardTime
                  ? timestampFormat(Number(stakingPoolInfo.lastRewardTime) * 1000)
                  : "--"}
              </Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>Creator</Typography>
              <Typography color="text.primary.main">
                {pool ? (
                  <Link href={explorerLink(pool.creator.toString())} target="_blank">
                    {pool?.creator ? shorten(pool.creator.toString()) : "--"}
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>Canister ID</Typography>
              <Typography color="text.primary">
                {pool ? (
                  <Link href={explorerLink(pool.canisterId.toString())} target="_blank">
                    {pool?.canisterId ? shorten(pool.canisterId.toString()) : "--"}
                  </Link>
                ) : null}
              </Typography>
            </Flex>

            <Flex justify="space-between">
              <Typography>Cycles Left</Typography>
              <Typography color="text.primary">{cycles ? cycleValueFormat(cycles.balance) : "--"}</Typography>
            </Flex>

            <Flex justify="flex-end">
              <Typography color="text.primary">
                <Link
                  href={`${INFO_URL}/staking-token/details/${pool?.canisterId.toString()}/${state}`}
                  target="_blank"
                >
                  Staking Pool Info
                </Link>
              </Typography>
            </Flex>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
