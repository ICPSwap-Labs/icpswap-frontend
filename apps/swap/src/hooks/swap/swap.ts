import { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useSwapContext } from "components/swap/context";
import { useCallback, useMemo } from "react";

export function useSwapNoLiquidityManager() {
  const { setNoLiquidity, noLiquidity } = useSwapContext();

  const callback = useCallback((noLiquidity: boolean | Null) => {
    if (isUndefinedOrNull(noLiquidity)) {
      setNoLiquidity(false);
      return;
    }

    setNoLiquidity(noLiquidity);
  }, []);

  return useMemo(() => ({ noLiquidity, updateNoLiquidity: callback }), [callback, noLiquidity]);
}
