import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface useLoadLiquidityPageCallbackProps {
  poolId: string | Null;
  positionId: string | bigint | Null;
  page: "increase" | "decrease" | "position";
}

export function useLoadLiquidityPageCallback({ poolId, positionId, page }: useLoadLiquidityPageCallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (nonUndefinedOrNull(poolId) && nonUndefinedOrNull(positionId)) {
      navigate(`/liquidity/${page}/${positionId.toString()}/${poolId}?path=${window.btoa(location.pathname)}`);
    }
  }, [navigate, poolId, positionId, location, page]);
}

interface useLoadAddLiquidityCallbackProps {
  token0: Token | Null | string;
  token1: Token | Null | string;
}

export function useLoadAddLiquidityCallback({ token0, token1 }: useLoadAddLiquidityCallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (nonUndefinedOrNull(token0) && nonUndefinedOrNull(token1)) {
      const token0Address = typeof token0 === "string" ? token0 : token0.address;
      const token1Address = typeof token1 === "string" ? token1 : token1.address;

      navigate(
        `/liquidity/add/${token0Address}/${token1Address}?path=${window.btoa(
          `${location.pathname}${location.search}`,
        )}`,
      );
    } else {
      navigate(`/liquidity/add?path=${window.btoa(`${location.pathname}${location.search}`)}`);
    }
  }, [navigate, token0, token1, location]);
}
