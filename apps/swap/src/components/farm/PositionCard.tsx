import { useCallback, useMemo, useState } from "react";
import { Box, Button, Typography } from "components/Mui";
import { MainCard, Flex } from "components/index";
import { Trans } from "@lingui/macro";
import { BigNumber, formatDollarAmount } from "@icpswap/utils";
import { FarmInfo, InitFarmArgs } from "@icpswap/types";
import { useUSDPrice } from "hooks/useUSDPrice";
import { usePosition } from "hooks/swap/usePosition";
import { Token } from "@icpswap/swap-sdk";
import { useFarmState } from "@icpswap/hooks";

import PositionRangeState from "./PositionState";
import { Unstake } from "./Unstake";
import { Stake } from "./Stake";

export interface PositionInfo {
  id: bigint;
  tickUpper: bigint;
  liquidity: bigint;
  tickLower: bigint;
}

export interface FarmPositionCardProps {
  farmInfo: FarmInfo | undefined;
  positionInfo: PositionInfo;
  unstake?: boolean;
  farmId: string;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
  resetData?: () => void;
}

export function FarmPositionCard({
  farmId,
  farmInfo,
  rewardToken,
  positionInfo,
  unstake,
  farmInitArgs,
  resetData,
}: FarmPositionCardProps) {
  const [unstakeOpen, setUnstakeOpen] = useState(false);
  const [stakeOpen, setStakeOpen] = useState(false);

  const poolId = useMemo(() => {
    if (!farmInfo) return undefined;
    return farmInfo.pool.toString();
  }, [farmInfo]);

  const { position } = usePosition({
    poolId,
    tickLower: positionInfo.tickLower,
    tickUpper: positionInfo.tickUpper,
    liquidity: positionInfo.liquidity,
  });

  const { token0, token1, outOfRange, token0Amount, token1Amount } = useMemo(() => {
    const pool = position?.pool;
    const tickUpper = position?.tickUpper;
    const tickLower = position?.tickLower;

    const token0 = pool?.token0;
    const token1 = pool?.token1;

    const token0Amount = position?.amount0.toSignificant(8);
    const token1Amount = position?.amount1.toSignificant(8);

    const outOfRange =
      pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
        ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
        : false;

    return {
      pool: position?.pool,
      tickUpper,
      tickLower,
      token0,
      token1,
      token0Amount,
      token1Amount,
      outOfRange,
    };
  }, [position]);

  const token0Price = useUSDPrice(token0);
  const token1Price = useUSDPrice(token1);

  const positionUSDValue = useMemo(() => {
    if (!token0Amount || !token1Amount || !token0Price || !token1Price) return undefined;

    return new BigNumber(token0Amount)
      .multipliedBy(token0Price)
      .plus(new BigNumber(token1Amount).multipliedBy(token1Price))
      .toString();
  }, [token0Amount, token1Amount, token0Price, token1Price]);

  const handleClick = useCallback(() => {
    if (unstake) {
      setUnstakeOpen(true);
      return;
    }

    setStakeOpen(true);
  }, [unstake]);

  const state = useFarmState(farmInfo);

  const disabled = useMemo(() => {
    if (state === "NOT_STARTED") return true;
    if (state === "FINISHED" && !unstake) return true;

    return false;
  }, [state, unstake]);

  return (
    <>
      <MainCard borderRadius="16px" level={2} padding="16px">
        <Flex fullWidth justify="space-between">
          <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
            {token0 && token1 ? `${token0.symbol}/${token1.symbol}(#${positionInfo.id.toString()})` : "--"}
          </Typography>

          <PositionRangeState outOfRange={outOfRange} />
        </Flex>

        <Flex sx={{ margin: "16px 0 0 0" }} justify="space-between" align="flex-end">
          <Box>
            <Typography>{positionUSDValue ? `~${formatDollarAmount(positionUSDValue)} USD` : "--"}</Typography>
            <Typography>{token0Amount && token0 ? `${token0Amount} ${token0.symbol}` : "--"}</Typography>
            <Typography>{token1Amount && token1 ? `${token1Amount} ${token1.symbol}` : "--"}</Typography>
          </Box>
          <Button variant="contained" sx={{ width: "120px", height: "48px" }} onClick={handleClick} disabled={disabled}>
            {unstake ? <Trans>Unstake</Trans> : <Trans>Stake</Trans>}
          </Button>
        </Flex>
      </MainCard>

      {unstake ? (
        <Unstake
          open={unstakeOpen}
          onClose={() => setUnstakeOpen(false)}
          position={position}
          positionId={positionInfo.id}
          farmId={farmId}
          farmInfo={farmInfo}
          farmInitArgs={farmInitArgs}
          rewardToken={rewardToken}
          resetData={resetData}
        />
      ) : (
        <Stake
          open={stakeOpen}
          onClose={() => setStakeOpen(false)}
          position={position}
          positionId={positionInfo.id}
          farmId={farmId}
          farmInfo={farmInfo}
          farmInitArgs={farmInitArgs}
          rewardToken={rewardToken}
          resetData={resetData}
        />
      )}
    </>
  );
}
