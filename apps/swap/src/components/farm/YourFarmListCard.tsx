import {
  useFarmInitArgs,
  useFarmState,
  useSwapPoolMetadata,
  useSwapUserPositions,
  useV3FarmRewardMetadata,
} from "@icpswap/hooks";
import type { FarmTvl } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { formatDollarAmount } from "@icpswap/utils";
import { TokenImage } from "components/Image";
import { Box, type BoxProps, type Theme, Typography, useTheme } from "components/Mui";
import { AnonymousPrincipal } from "constants/index";
import { useFarmApr, useFarmTvlValue, useIntervalUserFarmInfo, useStateColors } from "hooks/staking-farm";
import { usePositionsTotalValue } from "hooks/swap/index";
import { useToken } from "hooks/useCurrency";
import upperFirst from "lodash/upperFirst";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountPrincipal } from "store/auth/hooks";

interface YourFarmListCardProps {
  farmTvl: FarmTvl;
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
}

export function YourFarmListCard({ farmId, wrapperSx, showState }: YourFarmListCardProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  const { data: userFarmInfo } = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
  const { data: farmInitArgs } = useFarmInitArgs(farmId);
  const { data: userAllPositions } = useSwapUserPositions(userFarmInfo?.pool.toString(), principal?.toString());
  const [, token0] = useToken(userFarmInfo?.poolToken0.address);
  const [, token1] = useToken(userFarmInfo?.poolToken1.address);
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address);
  const { data: poolMetadata } = useSwapPoolMetadata(userFarmInfo?.pool.toString());

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

  const allAvailablePositionValue = usePositionsTotalValue({
    metadata: poolMetadata,
    positionInfos: userAvailablePositions,
  });

  const farmTvlValue = useFarmTvlValue({
    token0,
    token1,
    farmId,
  });

  const { data: rewardMetadata } = useV3FarmRewardMetadata(farmId);

  const state = useFarmState(userFarmInfo);

  const apr = useFarmApr({
    farmTvlValue,
    rewardToken,
    rewardMetadata,
    farmInitArgs,
    state,
  });

  const stateColor = useStateColors(state);

  const handelToDetails = useCallback(() => {
    navigate(`/farm/details/${farmId}`);
  }, [navigate, farmId]);

  return (
    <Box
      sx={{
        ...wrapperSx,
        cursor: "pointer",
        "&:hover": {
          "& .row-item": {
            background: theme.palette.background.level1,
          },
        },
        "& .row-item": {
          borderTop: `1px solid ${theme.palette.background.level1}`,
          padding: "20px 0",
          "&:first-of-type": {
            padding: "20px 0 20px 24px",
          },
          "&:last-of-type": {
            padding: "20px 24px 20px 0",
          },
        },
      }}
      onClick={handelToDetails}
    >
      <Flex gap="0 8px" className="row-item">
        <Flex>
          <TokenImage logo={token0?.logo} tokenId={token0?.address} size="24px" />
          <TokenImage logo={token1?.logo} tokenId={token1?.address} size="24px" />
        </Flex>

        <Typography sx={{ color: "text.primary" }}>
          {token0 && token1 ? `${token0.symbol}/${token1.symbol} ` : "--"}
        </Typography>
      </Flex>

      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
        <Typography sx={{ color: "text.primary" }}>{rewardToken ? `${rewardToken.symbol} ` : "--"}</Typography>
      </Flex>

      <Flex justify="flex-end" className="row-item">
        <Typography sx={{ color: "text.apr" }}>{apr ?? "--"}</Typography>
      </Flex>

      <Flex gap="0 4px" justify="flex-end" className="row-item">
        <Typography sx={{ color: "text.primary" }}>
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

      <Flex justify="flex-end" className="row-item">
        <Typography sx={{ color: "text.primary" }}>{farmTvlValue ? formatDollarAmount(farmTvlValue) : "--"}</Typography>
      </Flex>

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          {state ? (
            <Flex gap="0 8px">
              <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: stateColor }} />
              <Typography sx={{ color: stateColor }}>
                {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
              </Typography>
            </Flex>
          ) : (
            "--"
          )}
        </Flex>
      ) : null}
    </Box>
  );
}
