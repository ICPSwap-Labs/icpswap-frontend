import { Typography, Box } from "components/Mui";
import { Flex, LoadingRow, MainCard, NoData } from "@icpswap/ui";
import { useTheme } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { FarmTokenImages } from "components/farm/FarmTokenImages";
import { type FarmTvl } from "@icpswap/types";
import { useIntervalUserFarmInfo, useFarmApr, useUserPositionsValue, useFarmTvlValue } from "hooks/staking-farm";
import { useToken } from "hooks/useCurrency";
import { AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount } from "@icpswap/utils";
import {
  useV3FarmRewardMetadata,
  useFarmInitArgs,
  useSwapUserPositions,
  useSwapPoolMetadata,
  useFarms,
} from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { STATE } from "types/staking-farm";

interface TopLiveFarmCardProps {
  farmTvl: FarmTvl;
  farmId: string;
}

function TopLiveFarmCard({ farmId }: TopLiveFarmCardProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const history = useHistory();

  const userFarmInfo = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
  const { result: farmInitArgs } = useFarmInitArgs(farmId);
  const { result: userAllPositions } = useSwapUserPositions(userFarmInfo?.pool.toString(), principal?.toString());
  const [, token0] = useToken(userFarmInfo?.poolToken0.address);
  const [, token1] = useToken(userFarmInfo?.poolToken1.address);
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address);
  const { result: poolMetadata } = useSwapPoolMetadata(userFarmInfo?.pool.toString());

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions || !farmInitArgs || !poolMetadata) return undefined;

    if (farmInitArgs.priceInsideLimit === false) {
      return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
    }

    return userAllPositions
      .filter((position) => position.liquidity !== BigInt(0))
      .filter((position) => {
        const outOfRange = poolMetadata.tick < position.tickLower || poolMetadata.tick >= position.tickUpper;
        return !outOfRange;
      });
  }, [userAllPositions, farmInitArgs, poolMetadata]);

  const allAvailablePositionValue = useUserPositionsValue({
    metadata: poolMetadata,
    positionInfos: userAvailablePositions,
  });

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const farmTvlValue = useFarmTvlValue({
    token0,
    token1,
    farmId,
  });

  const { result: rewardMetadata } = useV3FarmRewardMetadata(farmId);

  const apr = useFarmApr({
    farmTvlValue,
    rewardToken,
    rewardTokenPrice,
    rewardMetadata,
    farmInitArgs,
    state: STATE.LIVE,
  });

  const handleClick = () => {
    history.push(`/farm/details/${farmId}`);
  };

  return (
    <MainCard
      level={1}
      padding="20px 16px"
      sx={{
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Flex justify="space-between">
        <FarmTokenImages rewardToken={rewardToken} token0={token0} token1={token1} />
        <Typography fontSize={12}>
          {rewardToken && token0 && token1 ? (
            <Trans>
              Stake {token0.symbol}/{token1.symbol} to earn {rewardToken.symbol}
            </Trans>
          ) : (
            "--"
          )}
        </Typography>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "12px 0 0 0" }}>
        <Box>
          <Typography fontSize={12}>
            <Trans>Farm</Trans>
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
            }}
          >
            {rewardToken ? rewardToken.symbol : "--"}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12} align="right">
            <Trans>APR</Trans>
          </Typography>
          <Typography
            align="right"
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
            }}
          >
            {apr ?? "--"}
          </Typography>
        </Box>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "16px 0 0 0" }}>
        <Box>
          <Typography fontSize={12}>
            <Trans>Your Available to Stake</Trans>
          </Typography>
          <Flex gap="0 2px" sx={{ margin: "6px 0 0 0" }}>
            <Typography fontSize={16} color="text.primary">
              {allAvailablePositionValue ? formatDollarAmount(allAvailablePositionValue) : "--"}
            </Typography>
            {userAvailablePositions ? (
              <Typography
                fontSize={12}
                fontWeight={500}
                color="text.primary"
                sx={{
                  width: "fit-content",
                  background: theme.palette.background.level4,
                  padding: "2px 8px",
                  borderRadius: "44px",
                }}
              >
                {userAvailablePositions.length}
              </Typography>
            ) : null}
          </Flex>
        </Box>

        <Box>
          <Typography fontSize={12} align="right">
            <Trans>Total Staked</Trans>
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "text.primary",
              margin: "6px 0 0 0",
              textAlign: "right",
            }}
          >
            {farmTvlValue ? `${formatDollarAmount(farmTvlValue)}` : "--"}
          </Typography>
        </Box>
      </Flex>
    </MainCard>
  );
}

export function TopLiveFarms() {
  const { result: allLiveFarms, loading } = useFarms("LIVE");

  const topLiveFarms = useMemo(() => {
    if (!allLiveFarms) return undefined;

    return allLiveFarms.slice(0, 4);
  }, [allLiveFarms]);

  return (
    <MainCard>
      <Typography color="text.primary" sx={{ fontSize: "18px", fontWeight: 500 }}>
        <Trans>Top Live Farms</Trans>
      </Typography>

      <Box mt="24px">
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : !allLiveFarms || allLiveFarms?.length === 0 ? (
          <Flex justify="center">
            <NoData />
          </Flex>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: "0 20px",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              "@media(max-width: 640px)": {
                gridTemplateColumns: "1fr",
                gap: "20px 0",
              },
            }}
          >
            {topLiveFarms?.map((farm) => (
              <TopLiveFarmCard key={farm[0].toString()} farmId={farm[0].toString()} farmTvl={farm[1]} />
            ))}
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
