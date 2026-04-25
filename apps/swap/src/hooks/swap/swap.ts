import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useSwapStore } from "components/swap/index";
import { useCallback, useMemo } from "react";

export function useSwapNoLiquidityManager() {
  const { setNoLiquidity, noLiquidity } = useSwapStore();

  const callback = useCallback(
    (noLiquidity: boolean | Null) => {
      if (isUndefinedOrNull(noLiquidity)) {
        setNoLiquidity(false);
        return;
      }

      setNoLiquidity(noLiquidity);
    },
    [setNoLiquidity],
  );

  return useMemo(() => ({ noLiquidity, updateNoLiquidity: callback }), [callback, noLiquidity]);
}
