import { useCallback, useContext, useMemo, useState, useEffect } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Trans, t } from "@lingui/macro";
import { useAllLiquidityLocks, usePoolTVLValue, usePositionsValue } from "@icpswap/hooks";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { Flex } from "components/index";
import { ChevronDown } from "react-feather";
import { Position } from "@icpswap/swap-sdk";
import { useLiquidityLocksImage } from "hooks/swap/index";
import { Null } from "@icpswap/types";
import { LoadingRow, LiquidityLock, Tooltip } from "@icpswap/ui";
import { FREE_LIQUIDITY_NAME } from "@icpswap/constants";
import { SwapContext } from "components/swap";

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

const DEFAULT_DISPLAY_NUMBER = 2;

export interface LiquidityLocksProps {
  poolId: string | Null;
}

export function LiquidityLocks({ poolId }: LiquidityLocksProps) {
  const theme = useTheme();
  const [moreInformation, setMoreInformation] = useState(false);
  const [tokenIds, setTokenIds] = useState<[string, string] | null>(null);
  const [locksValue, setLocksValue] = useState<null | { [name: string]: string }>(null);

  const { cachedPool: pool } = useContext(SwapContext);

  const poolTvlValue = usePoolTVLValue({ pool });

  useEffect(() => {
    // Reset locks value if pool changed
    if (poolId) {
      setLocksValue(null);
    }
  }, [poolId]);

  useEffect(() => {
    if (pool) {
      setTokenIds([pool.token0.address, pool.token1.address]);
    }
  }, [pool]);

  const { result: allLiquidityLocks, loading } = useAllLiquidityLocks(tokenIds, poolId, pool);

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

      if (new BigNumber(aLockValue).isLessThan(bLockValue)) return 1;
      if (new BigNumber(aLockValue).isGreaterThan(bLockValue)) return -1;

      return 0;
    });
  }, [JSON.stringify(allLiquidityLocks), JSON.stringify(locksValue)]);

  return (
    <Box sx={{ background: theme.palette.background.level1, borderRadius: "8px", padding: "12px 0 0 0" }}>
      <Flex justify="center" gap="0 4px">
        <Typography sx={{ fontSize: "12px" }}>
          <Trans>Liquidity locks</Trans>
        </Typography>

        <Tooltip
          iconSize="12px"
          tips={t`Liquidity is locked in a smart contract to prevent malicious transfers and ensure that there is sufficient liquidity support for tokens on the ICPSwap platform. Here, you can view the locked liquidity's duration and amount.`}
        />
      </Flex>

      <Box mt="10px" sx={{ padding: "0 8px 12px 8px" }}>
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : (
          <Flex vertical gap="8px 0" align="flex-start">
            {sortedLiquidityLocks?.map(([positions, principalId, name], index) => (
              <LiquidityLocksItem
                key={name}
                name={name}
                principalId={principalId}
                poolTvlValue={poolTvlValue}
                positions={positions}
                hidden={moreInformation === false && index > DEFAULT_DISPLAY_NUMBER - 1}
                setLocksValue={handleLocksValue}
                positionsValue={name === FREE_LIQUIDITY_NAME ? freeLiquidityValue : undefined}
                poolId={poolId}
                freeLiquidityValue={freeLiquidityValue}
              />
            ))}
          </Flex>
        )}
      </Box>

      {allLiquidityLocks && allLiquidityLocks.length + 1 > DEFAULT_DISPLAY_NUMBER ? (
        <Box
          sx={{
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.palette.background.level4,
            cursor: "pointer",
            borderRadius: "0 0 8px 8px",
          }}
          onClick={() => setMoreInformation(!moreInformation)}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 500, margin: "0 3px 0 0" }}>
            {moreInformation ? <Trans>less information</Trans> : <Trans>more information </Trans>}
          </Typography>
          <ChevronDown style={{ transform: moreInformation ? "rotate(180deg)" : "rotate(0deg)" }} size="16px" />
        </Box>
      ) : null}
    </Box>
  );
}
