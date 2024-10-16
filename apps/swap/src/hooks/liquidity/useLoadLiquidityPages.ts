import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";
import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface useLoadLiquidityPageCallbackProps {
  poolId: string | Null;
  positionId: string | Null;
  page: "increase" | "decrease";
}

export function useLoadLiquidityPageCallback({ poolId, positionId, page }: useLoadLiquidityPageCallbackProps) {
  const history = useHistory();
  const location = useLocation();

  return useCallback(() => {
    if (nonNullArgs(poolId) && nonNullArgs(positionId)) {
      history.push(`/liquidity/${page}/${positionId}/${poolId}?path=${window.btoa(location.pathname)}`);
    }
  }, [history, poolId, positionId, location, page]);
}

interface useLoadAddLiquidityCallbackProps {
  token0: Token | Null;
  token1: Token | Null;
}

export function useLoadAddLiquidityCallback({ token0, token1 }: useLoadAddLiquidityCallbackProps) {
  const history = useHistory();
  const location = useLocation();

  return useCallback(() => {
    if (nonNullArgs(token0) && nonNullArgs(token1)) {
      history.push(`/liquidity/add/${token0.address}/${token1.address}?path=${window.btoa(location.pathname)}`);
    }
  }, [history, token0, token1, location]);
}
