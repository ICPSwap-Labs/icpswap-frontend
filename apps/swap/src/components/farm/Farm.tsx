import { useMemo, useState } from "react";
import { Box, Typography, Button } from "components/Mui";
import { MainCard, Flex, Tooltip, Link } from "components/index";
import { useIntervalUserRewardInfo, useFarmUSDValue, useUserPositionsValue } from "hooks/staking-farm";
import { useTheme } from "@mui/styles";
import { useAccountPrincipal } from "store/auth/hooks";
import { t, Trans } from "@lingui/macro";
import { parseTokenAmount, BigNumber, formatDollarAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import {
  useFarmUserPositions,
  useFarmInitArgs,
  useSwapUserPositions,
  useSwapPoolMetadata,
  useFarmState,
} from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useFarmApr, useUserApr } from "hooks/staking-farm/useFarmApr";
import { FarmPositionCard } from "components/farm/index";
import { FarmInfo, FarmRewardMetadata } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";

import { AllPositions } from "./AllPositions";

export interface FarmMainProps {
  farmId: string;
  farmInfo: FarmInfo | undefined;
  token0: Token | undefined;
  token1: Token | undefined;
  rewardToken: Token | undefined;
  rewardMetadata: FarmRewardMetadata | undefined;
}

export function FarmMain({ farmId, farmInfo, token0, token1, rewardToken, rewardMetadata }: FarmMainProps) {
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();
  const [viewAll, setViewAll] = useState(false);
  const [refreshRewardsTrigger, setRefreshRewardsTrigger] = useState(0);

  const { result: farmInitArgs } = useFarmInitArgs(farmId);
  const { result: userAllPositions } = useSwapUserPositions(
    farmInfo?.pool.toString(),
    principal?.toString(),
    refreshRewardsTrigger,
  );
  const { result: deposits } = useFarmUserPositions(farmId, principal?.toString(), refreshRewardsTrigger);
  const { result: swapPoolMetadata } = useSwapPoolMetadata(farmInfo?.pool.toString());

  const state = useFarmState(farmInfo);

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions || !farmInitArgs) return undefined;

    if (farmInitArgs.priceInsideLimit === false) {
      return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
    }

    if (!swapPoolMetadata) return undefined;

    const availablePositions = userAllPositions
      .filter((position) => position.liquidity !== BigInt(0))
      .filter((position) => {
        const outOfRange = swapPoolMetadata.tick < position.tickLower || swapPoolMetadata.tick >= position.tickUpper;
        return !outOfRange;
      });

    return availablePositions;
  }, [userAllPositions, farmInitArgs, swapPoolMetadata]);

  const availablePositionsInfo = useMemo(() => {
    if (!userAvailablePositions) return undefined;

    return userAvailablePositions.map((ele) => ({
      liquidity: ele.liquidity,
      tickUpper: ele.tickUpper,
      tickLower: ele.tickLower,
    }));
  }, [userAvailablePositions]);

  const allAvailablePositionValue = useUserPositionsValue({
    metadata: swapPoolMetadata,
    positionInfos: availablePositionsInfo,
  });

  const stakedPositionsInfo = useMemo(() => {
    if (!deposits) return undefined;

    return deposits.map((ele) => ({
      liquidity: ele.liquidity,
      tickUpper: ele.tickUpper,
      tickLower: ele.tickLower,
    }));
  }, [deposits]);

  const stakedPositionValue = useUserPositionsValue({
    metadata: swapPoolMetadata,
    positionInfos: stakedPositionsInfo,
  });

  const positionIds = useMemo(() => {
    return deposits?.map((position) => position.positionId) ?? [];
  }, [deposits]);

  const __userRewardAmount = useIntervalUserRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || __userRewardAmount === undefined || !rewardToken) return undefined;
    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));
    return parseTokenAmount(__userRewardAmount, rewardToken.decimals).multipliedBy(userRewardRatio).toString();
  }, [__userRewardAmount, farmInitArgs, rewardToken]);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const { farmTvlValue, userTvl } = useFarmUSDValue({
    token0,
    token1,
    rewardToken,
    userRewardAmount,
    userFarmInfo: farmInfo,
    farmId,
  });

  const apr = useFarmApr({
    state,
    rewardToken,
    rewardTokenPrice,
    farmInitArgs,
    rewardMetadata,
    farmTvlValue,
  });

  const userApr = useUserApr({
    state,
    rewardToken,
    rewardTokenPrice,
    farmInitArgs,
    farmTvlValue,
    positionValue: stakedPositionValue,
    deposits,
    rewardAmount: userRewardAmount,
  });

  const handleSuccess = () => {
    setRefreshRewardsTrigger(refreshRewardsTrigger + 1);
  };

  return (
    <>
      <Box mt="16px">
        <MainCard
          padding="24px 0"
          level={2}
          border="level4"
          sx={{
            "@media(max-width: 640px)": {
              padding: "24px 0",
            },
          }}
        >
          <Box sx={{ padding: "0 16px" }}>
            <Flex gap="0 4px" align="center">
              <Typography>
                <Trans>APR</Trans>
              </Typography>
              <Tooltip
                iconSize="14px"
                tips={t`The current APR is calculated as an average based on the latest distribution rewards data. The actual returns from staked positions depend on the concentration of the selected price range, the staking duration, and the number of tokens staked.`}
              />
            </Flex>
            <Typography sx={{ color: "text.theme-secondary", fontSize: "24px", fontWeight: 600, margin: "16px 0 0 0" }}>
              {apr ?? "--"}
            </Typography>
          </Box>

          <Box mt="32px">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "0 16px",
                "@media(max-width: 640px)": {
                  gridTemplateColumns: "1fr",
                  gap: "24px 0",
                },
              }}
            >
              <Box>
                <Typography>
                  <Trans>Total Reward</Trans>
                </Typography>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {farmInfo && rewardToken ? (
                    <>
                      {parseTokenAmount(farmInfo.totalReward, rewardToken.decimals).toFormat()}&nbsp;
                      {rewardToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {farmInfo && rewardToken && rewardTokenPrice
                    ? `~${formatDollarAmount(
                        parseTokenAmount(farmInfo.totalReward, rewardToken.decimals)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Box>

              <Box>
                <Typography>
                  <Trans>Total Value Staked</Trans>
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {farmTvlValue ? `${formatDollarAmount(farmTvlValue)}` : "--"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                margin: "24px 0",
                height: "1px",
                background: theme.palette.background.level4,
              }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "0 16px",
                "@media(max-width: 640px)": {
                  gridTemplateColumns: "1fr",
                  gap: "24px 0",
                },
              }}
            >
              <Box>
                <Flex gap="0 4px">
                  <Typography>
                    <Trans>Reward Token</Trans>
                  </Typography>

                  <Tooltip
                    tips={t`You will receive the reward tokens you have earned after unstaking the staked positions.`}
                  />
                </Flex>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {userRewardAmount && rewardToken ? (
                    <>
                      {toSignificantWithGroupSeparator(userRewardAmount, 4)}&nbsp;
                      {rewardToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {userRewardAmount && rewardTokenPrice
                    ? `~${formatDollarAmount(
                        new BigNumber(userRewardAmount).multipliedBy(rewardTokenPrice).toString(),
                      )}`
                    : "--"}
                </Typography>
              </Box>

              <Box>
                <Flex gap="0 4px">
                  <Typography>
                    <Trans>Your APR</Trans>
                  </Typography>
                  <Tooltip
                    tips={t`The APR estimated based on the cumulative rewards you have received. The APR depends on the concentration of the price range selected for your staked positions, the staking duration, and the number of tokens staked.`}
                  />
                </Flex>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {userApr ? `${userApr}` : "--"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </MainCard>
      </Box>

      <Box mt="40px">
        <Box>
          <Typography>
            <Trans>Your Positions Available To Stake</Trans>
          </Typography>

          <Typography sx={{ fontSize: "20px", fontWeight: 500, color: "text.primary", margin: "10px 0 0 0" }}>
            {allAvailablePositionValue ? formatDollarAmount(allAvailablePositionValue) : "--"}
          </Typography>
        </Box>

        <Box mt="24px">
          <Flex gap="0 4px">
            <Typography>
              <Trans>
                {userAvailablePositions ? userAvailablePositions.length : "--"} Position Available For Staking
              </Trans>
            </Typography>

            {farmInitArgs && token0 && token1 ? (
              <Tooltip
                tips={t`Minimum Stake Number: ${`${toSignificantWithGroupSeparator(
                  parseTokenAmount(farmInitArgs.token0AmountLimit.toString(), token0.decimals).toString(),
                )} ${token0.symbol} / ${toSignificantWithGroupSeparator(
                  parseTokenAmount(farmInitArgs.token1AmountLimit.toString(), token1.decimals).toString(),
                )} ${token1.symbol}`}`}
              />
            ) : null}
          </Flex>

          {userAvailablePositions !== undefined && token0 && token1 ? (
            userAvailablePositions.length > 1 ? (
              <MainCard padding="16px" level={2} sx={{ margin: "8px 0 0 0" }}>
                <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 500 }}>
                  {`${token0.symbol}/${token1.symbol}`}
                </Typography>

                <Flex sx={{ margin: "10px 0 0 0" }} justify="space-between" align="center">
                  <Flex sx={{ lineHeight: "16px" }} vertical gap="4px 0">
                    {userAvailablePositions.map((e) => (
                      <Typography key={e.id.toString()}>(#{e.id.toString()})</Typography>
                    ))}
                  </Flex>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      height: "48px",
                    }}
                    onClick={() => setViewAll(true)}
                  >
                    <Trans>View All</Trans>
                  </Button>
                </Flex>

                <AllPositions
                  open={viewAll}
                  positions={userAvailablePositions}
                  farmId={farmId}
                  farmInfo={farmInfo}
                  farmInitArgs={farmInitArgs}
                  token0={token0}
                  token1={token1}
                  rewardToken={rewardToken}
                  onClose={() => setViewAll(false)}
                  refreshData={handleSuccess}
                />
              </MainCard>
            ) : userAvailablePositions.length > 0 ? (
              <Flex vertical gap="24px 0" sx={{ margin: "8px 0 0 0" }}>
                {userAvailablePositions.map((ele) => (
                  <FarmPositionCard
                    key={ele.id.toString()}
                    farmInfo={farmInfo}
                    farmId={farmId}
                    positionInfo={{
                      id: ele.id,
                      tickLower: ele.tickLower,
                      tickUpper: ele.tickUpper,
                      liquidity: ele.liquidity,
                    }}
                    farmInitArgs={farmInitArgs}
                    rewardToken={rewardToken}
                    resetData={handleSuccess}
                  />
                ))}
              </Flex>
            ) : (
              <MainCard padding="16px" level={2} sx={{ margin: "8px 0 0 0" }}>
                <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 500 }}>
                  {`${token0.symbol}/${token1.symbol}`}
                </Typography>
                <Box mt="16px">
                  <Box mt="24px">
                    <Link
                      to={`/liquidity/add/${token0.address}/${token1.address}?path=${window.btoa(
                        `/farm/details/${farmId}`,
                      )}`}
                    >
                      <Button fullWidth variant="contained" size="large" sx={{ height: "48px" }}>
                        <Trans>Add Liquidity</Trans>
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </MainCard>
            )
          ) : null}
        </Box>
      </Box>

      <Box sx={{ margin: "32px 0", height: "1px", background: theme.palette.background.level2 }} />

      <Box>
        <Box>
          <Typography>
            <Trans>Your Total Value Staked</Trans>
          </Typography>

          <Typography sx={{ fontSize: "20px", fontWeight: 500, color: "text.primary", margin: "10px 0 0 0" }}>
            {userTvl ? `${formatDollarAmount(userTvl)}` : "--"}
          </Typography>
        </Box>

        <Box mt="24px">
          <Flex gap="0 4px">
            <Typography>
              <Trans>{deposits ? deposits.length : "--"} Staked Positions</Trans>
            </Typography>

            <Tooltip tips={t`There are currently N positions staked.`} />
          </Flex>

          {deposits && deposits.length > 0 ? (
            <Flex vertical gap="24px 0" sx={{ margin: "8px 0 0 0" }}>
              {deposits.map((ele) => (
                <FarmPositionCard
                  key={ele.positionId.toString()}
                  farmInfo={farmInfo}
                  farmId={farmId}
                  positionInfo={{
                    id: ele.positionId,
                    tickLower: ele.tickLower,
                    tickUpper: ele.tickUpper,
                    liquidity: ele.liquidity,
                  }}
                  unstake
                  farmInitArgs={farmInitArgs}
                  rewardToken={rewardToken}
                  resetData={handleSuccess}
                />
              ))}
            </Flex>
          ) : null}
        </Box>
      </Box>

      {token0 && token1 && (userAvailablePositions?.length ?? 0) > 0 ? (
        <Box mt="24px">
          <Link
            to={`/liquidity/add/${token0.address}/${token1.address}?path=${window.btoa(`/farm/details/${farmId}`)}`}
          >
            <Button fullWidth variant="contained" size="large" sx={{ height: "48px" }}>
              <Trans>Add Liquidity</Trans>
            </Button>
          </Link>
        </Box>
      ) : null}
    </>
  );
}
