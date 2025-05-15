import { usePoolByPoolId } from "hooks/swap";
import { useMemo } from "react";
import { isNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { PositionTableUI } from "components/liquidity/index";
import { useLiquidityLockIds, useMultiPositionInfos, useExtraBlackHolePositionInfos } from "@icpswap/hooks";
import { PositionDetails } from "types/swap";
import { useTranslation } from "react-i18next";

interface BlackHolePositionsProps {
  poolId: string | Null;
}

export function BlackHolePositions({ poolId }: BlackHolePositionsProps) {
  const { t } = useTranslation();
  const [, pool] = usePoolByPoolId(poolId);

  const tokenIds = useMemo(() => {
    if (isNullArgs(pool)) return null;
    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const { result: liquidityLocks } = useLiquidityLockIds(tokenIds);

  const blackHoleIds = useMemo(() => {
    if (!liquidityLocks) return null;

    return liquidityLocks.filter((e) => e.alias && e.alias[0] === "Black Hole").map((e) => e.ledger_id.toString());
  }, [liquidityLocks]);

  const { result: __positions, loading } = useMultiPositionInfos(poolId, blackHoleIds);
  const extraPositions = useExtraBlackHolePositionInfos(poolId);

  const positions = useMemo(() => {
    if (isNullArgs(__positions)) return null;

    const __extraPositions =
      extraPositions?.filter((e) => !!e).map((ele) => ({ ...ele, poolId }) as PositionDetails) ?? [];

    return __positions
      .filter((e) => !!e)
      .flat()
      .map((ele) => ({ ...ele, poolId }) as PositionDetails)
      .concat(__extraPositions);
  }, [__positions, extraPositions]);

  return (
    <PositionTableUI
      loading={loading}
      positions={positions}
      poolId={poolId}
      totalElements={0}
      pagination={{ pageNum: 1, pageSize: 10 }}
      empty={t("info.tools.black.hole.empty")}
    />
  );
}
