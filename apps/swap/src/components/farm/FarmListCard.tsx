import { Typography, Box, BoxProps, useTheme } from "components/Mui";
import { Flex, Tooltip, APRPanel, Link } from "@icpswap/ui";
import { useMemo } from "react";
import {
  useIntervalUserFarmInfo,
  useFarmApr,
  useFarmTvlValue,
  useStateColors,
  useUserTvlValue,
  useIntervalUserRewardInfo,
} from "hooks/staking-farm";
import { usePositionsValueByInfos } from "hooks/swap/index";
import { useToken } from "hooks/useCurrency";
import { AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, BigNumber, toSignificantWithGroupSeparator } from "@icpswap/utils";
import {
  useV3FarmRewardMetadata,
  useFarmInitArgs,
  useSwapUserPositions,
  useSwapPoolMetadata,
  useFarmState,
  useFarmUserPositions,
} from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { TokenImage } from "components/index";
import upperFirst from "lodash/upperFirst";
import dayjs from "dayjs";
import { FilterState } from "types/staking-farm";

import { PendingPanel } from "./PendingPanel";

const DAYJS_FORMAT0 = "MMMM D, YYYY";
const DAYJS_FORMAT1 = "h:mm A";

interface FarmListCardProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
}

export function FarmListCard({ farmId, wrapperSx, showState, your, filterState }: FarmListCardProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const userFarmInfo = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);
  const { result: farmInitArgs } = useFarmInitArgs(farmId);
  const { result: userAllPositions } = useSwapUserPositions(userFarmInfo?.pool.toString(), principal?.toString());
  const [, token0] = useToken(userFarmInfo?.poolToken0.address);
  const [, token1] = useToken(userFarmInfo?.poolToken1.address);
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address);
  const { result: poolMetadata } = useSwapPoolMetadata(userFarmInfo?.pool.toString());
  const { result: deposits } = useFarmUserPositions(farmId, principal?.toString());

  const state = useFarmState(userFarmInfo);

  const positionIds = useMemo(() => {
    return deposits?.map((position) => position.positionId) ?? [];
  }, [deposits]);

  const __userRewardAmount = useIntervalUserRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || __userRewardAmount === undefined || !rewardToken) return undefined;
    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));
    return parseTokenAmount(__userRewardAmount, rewardToken.decimals).multipliedBy(userRewardRatio).toString();
  }, [__userRewardAmount, farmInitArgs, rewardToken]);

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions || !farmInitArgs || !poolMetadata) return undefined;
    // No need positions if farm is finished or closed
    if (!state || state === "FINISHED" || state === "CLOSED") return undefined;

    if (farmInitArgs.priceInsideLimit === false) {
      return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
    }

    return userAllPositions
      .filter((position) => position.liquidity !== BigInt(0))
      .filter((position) => {
        const outOfRange = poolMetadata.tick < position.tickLower || poolMetadata.tick >= position.tickUpper;
        return !outOfRange;
      });
  }, [userAllPositions, farmInitArgs, poolMetadata, state]);

  const allAvailablePositionValue = usePositionsValueByInfos({
    metadata: poolMetadata,
    positionInfos: userAvailablePositions,
  });

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const farmTvlValue = useFarmTvlValue({
    token0,
    token1,
    farmId,
  });
  const userTvlValue = useUserTvlValue({ farmId, token0, token1 });

  const { result: rewardMetadata } = useV3FarmRewardMetadata(farmId);

  const apr = useFarmApr({
    farmTvlValue,
    rewardToken,
    rewardMetadata,
    farmInitArgs,
    state,
  });

  const stateColor = useStateColors(state);

  return (
    <Link to={`/farm/details/${farmId}`}>
      <Box
        sx={{
          ...wrapperSx,
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
      >
        <Flex gap="0 8px" className="row-item">
          <Flex>
            <TokenImage logo={token0?.logo} tokenId={token0?.address} size="24px" />
            <TokenImage logo={token1?.logo} tokenId={token1?.address} size="24px" />
          </Flex>

          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {token0 && token1 ? `${token0.symbol}/${token1.symbol} ` : "--"}
          </Typography>
        </Flex>

        <Flex gap="0 8px" className="row-item">
          <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {rewardToken ? `${rewardToken.symbol} ` : "--"}
          </Typography>
          <PendingPanel rewardToken={rewardToken} farmId={farmId} state={state} />
        </Flex>

        <Flex justify="flex-end" className="row-item">
          {apr ? (
            <APRPanel value={apr} />
          ) : (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              --
            </Typography>
          )}
        </Flex>

        {filterState === FilterState.FINISHED ? null : (
          <Flex gap="0 4px" justify="flex-end" className="row-item">
            {state === "FINISHED" || state === "CLOSED" ? (
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                --
              </Typography>
            ) : (
              <>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
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

                {state === "NOT_STARTED" && userFarmInfo ? (
                  <Tooltip
                    tips={`
                   As soon as the Farm goes live on ${dayjs(Number(userFarmInfo.startTime) * 1000).format(
                     DAYJS_FORMAT0,
                   )} at ${dayjs(Number(userFarmInfo.startTime) * 1000).format(DAYJS_FORMAT1)}, you can start staking.`}
                    iconSize="14px"
                  />
                ) : null}
              </>
            )}
          </Flex>
        )}

        {your ? (
          <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
            <Flex justify="flex-end">
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {userRewardAmount && rewardToken ? (
                  <>
                    {toSignificantWithGroupSeparator(userRewardAmount, 4)}&nbsp;
                    {rewardToken.symbol}
                  </>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>
            <Flex justify="flex-end">
              <Typography sx={{ fontSize: "12px" }}>
                {userRewardAmount && rewardTokenPrice
                  ? `~${formatDollarAmount(new BigNumber(userRewardAmount).multipliedBy(rewardTokenPrice).toString())}`
                  : "--"}
              </Typography>
            </Flex>
          </Flex>
        ) : null}

        {your ? (
          <Flex justify="flex-end" className="row-item">
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {userTvlValue ? formatDollarAmount(userTvlValue) : "--"}
            </Typography>
          </Flex>
        ) : filterState !== FilterState.FINISHED ? (
          <Flex justify="flex-end" className="row-item">
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {farmTvlValue ? formatDollarAmount(farmTvlValue) : "--"}
            </Typography>
          </Flex>
        ) : null}

        {filterState === FilterState.FINISHED ? (
          <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
            <Flex justify="flex-end">
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {userFarmInfo && rewardToken ? (
                  <>
                    {toSignificantWithGroupSeparator(
                      parseTokenAmount(userFarmInfo.totalReward, rewardToken.decimals).toString(),
                      6,
                    )}
                    &nbsp;
                    {rewardToken.symbol}
                  </>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>
            <Flex justify="flex-end">
              <Typography sx={{ fontSize: "12px" }}>
                {userFarmInfo && rewardToken && rewardTokenPrice
                  ? `~${formatDollarAmount(
                      parseTokenAmount(userFarmInfo.totalReward, rewardToken.decimals)
                        .multipliedBy(rewardTokenPrice)
                        .toString(),
                    )}`
                  : "--"}
              </Typography>
            </Flex>
          </Flex>
        ) : null}

        {showState ? (
          <Flex justify="flex-end" className="row-item">
            {state ? (
              <Flex gap="0 8px">
                <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: stateColor }} />
                <Typography variant="body2" sx={{ color: stateColor }}>
                  {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
                </Typography>
              </Flex>
            ) : (
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                --
              </Typography>
            )}
          </Flex>
        ) : null}
      </Box>
    </Link>
  );
}
