import { useMemo, useState } from "react";
import { Box, Typography, Button, useTheme } from "components/Mui";
import { MainCard, Flex, Tooltip, Link } from "components/index";
import { useFarmTvlValue, useUserTvlValue, useFarmUserRewardAmountAndValue } from "hooks/staking-farm";
import { usePositionsTotalValue, usePositionsValue } from "hooks/swap/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { parseTokenAmount, formatDollarAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import {
  useFarmUserPositions,
  useFarmInitArgs,
  useSwapUserPositions,
  useSwapPoolMetadata,
  useFarmState,
} from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useFarmApr, useUserApr } from "hooks/staking-farm/useFarmApr";
import { FarmPositionCard } from "components/farm/index";
import { FarmInfo, FarmRewardMetadata } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const theme = useTheme();
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

  const allAvailablePositionValue = usePositionsTotalValue({
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

  const stakedPositionsValues = usePositionsValue({
    metadata: swapPoolMetadata,
    positionInfos: stakedPositionsInfo,
  });

  const positionIds = useMemo(() => {
    return deposits?.map((position) => position.positionId) ?? [];
  }, [deposits]);

  const { userRewardAmount, userRewardValue } = useFarmUserRewardAmountAndValue({
    farmId,
    positionIds,
    refresh: refreshRewardsTrigger,
    rewardToken,
    farmInitArgs,
  });

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const farmTvlValue = useFarmTvlValue({ farmId, token0, token1 });
  const userTvlValue = useUserTvlValue({ farmId, token0, token1 });

  const apr = useFarmApr({
    state,
    rewardToken,
    farmInitArgs,
    rewardMetadata,
    farmTvlValue,
  });

  const userApr = useUserApr({
    state,
    rewardToken,
    farmInitArgs,
    farmTvlValue,
    positionsValue: stakedPositionsValues,
    deposits,
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
              <Typography>{t("common.apr")}</Typography>
              <Tooltip
                iconSize="14px"
                tips={t`The current APR is calculated as an average based on the latest distribution rewards data. The actual returns from staked positions depend on the concentration of the selected price range, the staking duration, and the number of tokens staked.`}
              />
            </Flex>
            <Typography sx={{ color: "text.apr", fontSize: "20px", fontWeight: 600, margin: "16px 0 0 0" }}>
              {apr ?? "--"}
            </Typography>
          </Box>

          <Box mt="24px">
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
                <Typography>{t("farm.total.reward")}</Typography>

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
                <Typography>{t("farm.total.value.staked")}</Typography>
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
                  <Typography>{t("common.reward.token")}</Typography>

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
                  {userRewardValue ? `~${formatDollarAmount(userRewardValue)}` : "--"}
                </Typography>
              </Box>

              <Box>
                <Flex gap="0 4px">
                  <Typography>{t("common.apr.your")}</Typography>
                  <Tooltip tips={t("farm.your.apr.tips")} />
                </Flex>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.apr" }}>
                  {userApr ? `${userApr}` : "--"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </MainCard>
      </Box>

      <Box mt="24px">
        <Box>
          <Typography>{t("farm.positions.stake.title")}</Typography>

          <Typography sx={{ fontSize: "20px", fontWeight: 500, color: "text.primary", margin: "10px 0 0 0" }}>
            {allAvailablePositionValue ? formatDollarAmount(allAvailablePositionValue) : "--"}
          </Typography>
        </Box>

        <Box mt="24px">
          <Flex gap="0 4px">
            <Typography>
              {t("farm.position.staking", { amount: userAvailablePositions ? userAvailablePositions.length : "--" })}
            </Typography>

            {farmInitArgs && token0 && token1 ? (
              <Tooltip
                tips={t("farm.minimum.stake", {
                  amount: `${toSignificantWithGroupSeparator(
                    parseTokenAmount(farmInitArgs.token0AmountLimit.toString(), token0.decimals).toString(),
                  )} ${token0.symbol} / ${toSignificantWithGroupSeparator(
                    parseTokenAmount(farmInitArgs.token1AmountLimit.toString(), token1.decimals).toString(),
                  )} ${token1.symbol}`,
                })}
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
                    {t("common.view.all")}
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
                        {t("swap.add.liquidity")}
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </MainCard>
            )
          ) : null}
        </Box>
      </Box>

      <Box sx={{ margin: "24px 0", height: "1px", background: theme.palette.background.level2 }} />

      <Box>
        <Box>
          <Typography>{t("farm.your.total.staked")}</Typography>

          <Typography sx={{ fontSize: "20px", fontWeight: 500, color: "text.primary", margin: "10px 0 0 0" }}>
            {userTvlValue ? `${formatDollarAmount(userTvlValue)}` : "--"}
          </Typography>
        </Box>

        <Box mt="24px">
          <Flex gap="0 4px">
            <Typography>{t("farm.staked.positions", { amount: deposits ? deposits.length : "--" })}</Typography>

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
              {t("swap.add.liquidity")}
            </Button>
          </Link>
        </Box>
      ) : null}
    </>
  );
}
