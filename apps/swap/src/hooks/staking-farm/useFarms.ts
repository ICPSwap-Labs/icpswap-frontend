import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-farm";
import { getFarmsByFilter } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { FarmState } from "@icpswap/types";

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
      const farms = await getFarmsByFilter({ state, pair, token, user });
      setFarms(farms);
      setLoading(false);
    }

    call();
  }, [filter, state, user, pair, token]);

  return useMemo(() => ({ loading, result: farms }), [loading, farms]);
}
