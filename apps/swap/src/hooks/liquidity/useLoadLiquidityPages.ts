import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";
import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface useLoadLiquidityPageCallbackProps {
  poolId: string | Null;
  positionId: string | bigint | Null;
  page: "increase" | "decrease" | "position";
}

export function useLoadLiquidityPageCallback({ poolId, positionId, page }: useLoadLiquidityPageCallbackProps) {
  const history = useHistory();
  const location = useLocation();

  return useCallback(() => {
    if (nonNullArgs(poolId) && nonNullArgs(positionId)) {
      history.push(`/liquidity/${page}/${positionId.toString()}/${poolId}?path=${window.btoa(location.pathname)}`);
    }
  }, [history, poolId, positionId, location, page]);
}

interface useLoadAddLiquidityCallbackProps {
  token0: Token | Null | string;
  token1: Token | Null | string;
}

export function useLoadAddLiquidityCallback({ token0, token1 }: useLoadAddLiquidityCallbackProps) {
  const history = useHistory();
  const location = useLocation();

  return useCallback(() => {
    if (nonNullArgs(token0) && nonNullArgs(token1)) {
      const token0Address = typeof token0 === "string" ? token0 : token0.address;
      const token1Address = typeof token1 === "string" ? token1 : token1.address;

      history.push(
        `/liquidity/add/${token0Address}/${token1Address}?path=${window.btoa(
          `${location.pathname}${location.search}`,
        )}`,
      );
    } else {
      history.push(`/liquidity/add?path=${window.btoa(`${location.pathname}${location.search}`)}`);
    }
  }, [history, token0, token1, location]);
}
