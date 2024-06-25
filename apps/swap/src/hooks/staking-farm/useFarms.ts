import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-farm";
import { getFarms, getFarmUserPositions } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { FarmState, FarmTvl } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";

export interface UseFarmsArgs {
  state: FarmState | undefined;
  filter: FilterState;
}

export function useFarms({ state, filter }: UseFarmsArgs) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [farms, setFarms] = useState<null | Array<[Principal, FarmTvl]>>(null);

  useEffect(() => {
    async function call() {
      if (!principal) return;

      setLoading(true);

      if (filter === FilterState.YOUR) {
        const farms = await getFarms(undefined);

        const result = (
          await Promise.all(
            farms.map(async (farm) => {
              const positions = await getFarmUserPositions(farm[0].toString(), principal.toString());
              return { id: farm[0].toString(), positions };
            }),
          )
        ).flat();

        const stakedFarms = farms.filter((farm) => {
          const id = farm[0].toString();

          const positions = result.find((e) => e.id === id)?.positions;

          return positions && positions.length > 0;
        });

        setFarms(stakedFarms);
      } else {
        const farms = await getFarms(state);
        setFarms(farms);
      }

      setLoading(false);
    }

    call();
  }, [filter, state, principal]);

  return useMemo(() => ({ loading, result: farms }), [loading, farms]);
}
