import { usePoolByPoolId } from "hooks/swap";
import { useSneedLedger } from "hooks/useSneedLedger";
import { useMemo } from "react";
import { isNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { PositionTableUI } from "components/liquidity/index";
import { useSwapUserPositions } from "@icpswap/hooks";
import { PositionDetails } from "types/swap";
import { useTranslation } from "react-i18next";

interface SneedLockedPositionsProps {
  poolId: string | Null;
}

export function SneedLockedPositions({ poolId }: SneedLockedPositionsProps) {
  const { t } = useTranslation();
  const [, pool] = usePoolByPoolId(poolId);

  const tokenIds = useMemo(() => {
    if (isNullArgs(pool)) return null;
    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const sneedLedger = useSneedLedger(tokenIds);

  const { result: __positions, loading } = useSwapUserPositions(poolId, sneedLedger);

  const positions = useMemo(() => {
    if (isNullArgs(__positions)) return null;

    return __positions.map((ele) => ({ ...ele, poolId }) as PositionDetails);
  }, [__positions]);

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
