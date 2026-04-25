import { useExtraBlackHolePositionInfos, useLiquidityLockIds, useMultiPositionInfos } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { PositionTableUI } from "components/liquidity/index";
import { usePoolByPoolId } from "hooks/swap";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { PositionDetails } from "types/swap";

interface BlackHolePositionsProps {
  poolId: string | Null;
}

export function BlackHolePositions({ poolId }: BlackHolePositionsProps) {
  const { t } = useTranslation();
  const [, pool] = usePoolByPoolId(poolId);

  const tokenIds = useMemo(() => {
    if (isUndefinedOrNull(pool)) return null;
    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const { data: liquidityLocks } = useLiquidityLockIds(tokenIds);

  const blackHoleIds = useMemo(() => {
    if (!liquidityLocks) return null;

    return liquidityLocks.filter((e) => e.alias && e.alias[0] === "Black Hole").map((e) => e.ledger_id.toString());
  }, [liquidityLocks]);

  const { result: __positions, loading } = useMultiPositionInfos(poolId, blackHoleIds);
  const extraPositions = useExtraBlackHolePositionInfos(poolId);

  const positions = useMemo(() => {
    if (isUndefinedOrNull(__positions)) return null;

    const __extraPositions =
      extraPositions?.filter((e) => !!e).map((ele) => ({ ...ele, poolId }) as PositionDetails) ?? [];

    return __positions
      .filter((e) => !!e)
      .flat()
      .map((ele) => ({ ...ele, poolId }) as PositionDetails)
      .concat(__extraPositions);
  }, [__positions, extraPositions, poolId]);

  return (
    <PositionTableUI
      loading={loading}
      positions={positions}
      poolId={poolId}
      totalElements={0}
      page={1}
      empty={t("info.tools.black.hole.empty")}
    />
  );
}
