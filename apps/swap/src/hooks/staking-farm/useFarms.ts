import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-farm";
import { getFarmUserPositions, getFarmsByState } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { FarmState } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";

export interface UseFarmsArgs {
  state: FarmState | undefined;
  filter: FilterState;
}

export function useFarms({ state, filter }: UseFarmsArgs) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [farms, setFarms] = useState<null | Array<Principal>>(null);

  useEffect(() => {
    async function call() {
      if (filter === FilterState.YOUR) {
        if (!principal) {
          setFarms(null);
          return;
        }

        setLoading(true);

        const farms = await getFarmsByState(undefined);

        const result = (
          await Promise.all(
            farms.map(async (farmId) => {
              const positions = await getFarmUserPositions(farmId.toString(), principal.toString());
              return { id: farmId.toString(), positions };
            }),
          )
        ).flat();

        const stakedFarms = farms.filter((farmId) => {
          const positions = result.find((e) => e.id === farmId.toString())?.positions;

          return positions && positions.length > 0;
        });

        setFarms(stakedFarms);
      } else {
        setLoading(true);
        const farms = await getFarmsByState(state);
        setFarms(farms);
      }

      setLoading(false);
    }

    call();
  }, [filter, state, principal]);

  return useMemo(() => ({ loading, result: farms }), [loading, farms]);
}
