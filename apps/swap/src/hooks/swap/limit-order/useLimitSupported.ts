import { useEffect, useMemo, useState } from "react";
import { nonUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { Null, ResultStatus } from "@icpswap/types";
import { swapPool } from "@icpswap/actor";

export interface UseLimitSupportedProps {
  canisterId: string | Null;
}

export function useLimitSupported({ canisterId }: UseLimitSupportedProps) {
  const [limitAvailableState, setLimitAvailableState] = useState<boolean | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    async function call() {
      setLimitAvailableState(null);
      setAvailable(null);

      if (nonUndefinedOrNull(canisterId)) {
        const result = resultFormat(await (await swapPool(canisterId)).getLimitOrders());

        if ("message" in result && result.message.includes(`has no query method 'getLimitOrders'`)) {
          setAvailable(false);
        } else {
          setAvailable(result.status === ResultStatus.OK);
        }
      }

      if (nonUndefinedOrNull(canisterId)) {
        const result = resultFormat<boolean>(await (await swapPool(canisterId)).getLimitOrderAvailabilityState());

        if ("message" in result && result.message.includes(`has no query method`)) {
          setLimitAvailableState(false);
        }

        if (nonUndefinedOrNull(result.data)) {
          setLimitAvailableState(result.data);
        }
      }
    }

    call();
  }, [canisterId]);

  // available by default
  return useMemo(
    () =>
      nonUndefinedOrNull(available) && nonUndefinedOrNull(limitAvailableState)
        ? available === true && limitAvailableState === true
        : true,
    [available, limitAvailableState],
  );
}
