import { useEffect, useMemo, useState } from "react";
import { getV3StakingFarms } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import type { FarmTvl } from "@icpswap/types";

export async function getAllFarms() {
  return await getV3StakingFarms("all");
}

export function useAllFarmPools() {
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Array<[Principal, FarmTvl]>>([]);

  useEffect(() => {
    async function call() {
      setLoading(true);
      const farms = await getAllFarms();
      setFarms(farms);
      setLoading(false);
    }

    call();
  }, []);

  return useMemo(() => ({ result: farms, loading }), [farms, loading]);
}
