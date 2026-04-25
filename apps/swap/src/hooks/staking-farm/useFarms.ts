import type { Principal } from "@icp-sdk/core/principal";
import { getFarmsByFilter } from "@icpswap/hooks";
import type { FarmState } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-farm";

export interface UseFarmsArgs {
  state: FarmState | undefined;
  filter: FilterState;
  pair?: string | null;
  token?: string | null;
  user?: string | null;
}

export function useFarms({ state, filter, pair, token, user }: UseFarmsArgs) {
  const [loading, setLoading] = useState<boolean>(false);
  const [farms, setFarms] = useState<null | Array<Principal>>(null);

  useEffect(() => {
    async function call() {
      setLoading(true);

      if (filter === FilterState.YOUR && !user) {
        setFarms([]);
        setLoading(false);
        return;
      }

      const farms = await getFarmsByFilter({ state, pair, token, user });
      setFarms(farms);
      setLoading(false);
    }

    call();
  }, [filter, state, user, pair, token]);

  return useMemo(() => ({ loading, result: farms }), [loading, farms]);
}
