import { useCallback, useMemo, useState } from "react";
import { Box, useTheme } from "ui-component/Mui";
import { useAllLiquidityLocks, usePoolTVLValue, usePositionsValue } from "@icpswap/hooks";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { Position, Pool } from "@icpswap/swap-sdk";
import { useLiquidityLocksImage } from "hooks/swap/index";
import { Null } from "@icpswap/types";
import { LoadingRow, LiquidityLock, Flex } from "@icpswap/ui";
import { FREE_LIQUIDITY_NAME } from "@icpswap/constants";

interface LiquidityLocksItemProps {
  name: string;
  principalId?: string;
  poolTvlValue: string | Null;
  positions?: Position[] | Null;
  hidden?: boolean;
  setLocksValue?: (name: string, value: string) => void;
  positionsValue?: string | Null;
  poolId: string | Null;
  freeLiquidityValue?: string | Null;
}

function LiquidityLocksItem({
  name,
  principalId,
  positions,
  poolTvlValue,
  setLocksValue,
  hidden = false,
  poolId,
  freeLiquidityValue,
}: LiquidityLocksItemProps) {
  const locksImage = useLiquidityLocksImage(name, principalId);

  const positionsValue = usePositionsValue(positions);

  return (
    <LiquidityLock
      name={name}
      principalId={principalId}
      poolTvlValue={poolTvlValue}
      positions={positions}
      hidden={hidden}
      setLocksValue={setLocksValue}
      positionsValue={name === FREE_LIQUIDITY_NAME ? freeLiquidityValue : positionsValue}
      poolId={poolId}
      lockImage={locksImage}
    />
  );
}

export interface LiquidityLocksProps {
  poolId: string | undefined;
  pool: Pool | Null;
}

export function LiquidityLocks({ pool, poolId }: LiquidityLocksProps) {
  const theme = useTheme();
  const [locksValue, setLocksValue] = useState<null | { [name: string]: string }>(null);

  const poolTvlValue = usePoolTVLValue({ pool });

  const { result: allLiquidityLocks, loading } = useAllLiquidityLocks(
    pool ? [pool.token0.address, pool.token1.address] : undefined,
    poolId,
    pool,
  );

  const handleLocksValue = useCallback(
    (name: string, value: string) => {
      const __locksValue = locksValue ?? {};
      __locksValue[name] = value;
      setLocksValue(__locksValue);
    },
    [locksValue, setLocksValue],
  );

  const freeLiquidityValue = useMemo(() => {
    if (!poolTvlValue) return;

    // Free liquidity Value + 1
    if (locksValue && allLiquidityLocks && Object.keys(locksValue).length === allLiquidityLocks.length + 1) {
      return new BigNumber(poolTvlValue)
        .minus(
          Object.keys(locksValue)
            .filter((key) => key !== FREE_LIQUIDITY_NAME)
            .reduce((prev, curr) => {
              return prev.plus(locksValue[curr]);
            }, new BigNumber(0)),
        )
        .toString();
    }

    return "0";
  }, [locksValue, allLiquidityLocks, poolTvlValue]);

  const sortedLiquidityLocks = useMemo(() => {
    if (isNullArgs(allLiquidityLocks)) return undefined;
    if (isNullArgs(locksValue)) return allLiquidityLocks;

    const __allLiquidityLocks = [...allLiquidityLocks, [undefined, undefined, FREE_LIQUIDITY_NAME]] as Array<
      [Position[] | undefined, string | undefined, string]
    >;

    return __allLiquidityLocks.sort((a, b) => {
      const aLockValue = locksValue[a[2]];
      const bLockValue = locksValue[b[2]];

      if (aLockValue < bLockValue) return 1;
      if (aLockValue > bLockValue) return -1;

      return 0;
    });
  }, [JSON.stringify(allLiquidityLocks), JSON.stringify(locksValue)]);

  return (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "12px 0 0 0",
        border: `1px solid ${theme.colors.border0}`,
      }}
    >
      <Box sx={{ padding: "0 8px 12px 8px" }}>
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : (
          <Flex vertical gap="8px 0" align="flex-start">
            {sortedLiquidityLocks?.map(([positions, principalId, name]) => (
              <LiquidityLocksItem
                key={name}
                name={name}
                principalId={principalId}
                poolTvlValue={poolTvlValue}
                positions={positions}
                setLocksValue={handleLocksValue}
                positionsValue={name === FREE_LIQUIDITY_NAME ? freeLiquidityValue : undefined}
                poolId={poolId}
                freeLiquidityValue={freeLiquidityValue}
              />
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
