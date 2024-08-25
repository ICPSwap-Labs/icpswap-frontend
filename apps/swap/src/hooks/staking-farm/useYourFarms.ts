import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-farm";
import { getUserFarms } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { useAccountPrincipal } from "store/auth/hooks";

export interface UseFarmsArgs {
  filter: FilterState;
}

export function useYourFarms({ filter }: UseFarmsArgs) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [farms, setFarms] = useState<null | Array<Principal>>(null);

  useEffect(() => {
    async function call() {
      if (!principal || filter !== FilterState.YOUR) {
        setFarms(null);
        return;
      }

      setLoading(true);
      const farms = await getUserFarms(principal.toString());
      setFarms(farms);
      setLoading(false);
    }

    call();
  }, [principal]);

  return useMemo(() => ({ loading, result: farms }), [loading, farms]);
}
