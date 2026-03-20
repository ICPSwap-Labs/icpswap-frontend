import type { Principal } from "@icp-sdk/core/principal";
import { getUserFarms } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { useAccountPrincipal } from "store/auth/hooks";

export function useYourFarms() {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [farms, setFarms] = useState<null | Array<Principal>>(null);

  useEffect(() => {
    async function call() {
      if (!principal) {
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
