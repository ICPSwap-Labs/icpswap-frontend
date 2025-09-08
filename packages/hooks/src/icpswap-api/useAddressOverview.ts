import { useCallback } from "react";
import { Null, AddressOverview } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useAddressOverview(pid: string | Null, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!pid) return undefined;
      return (await icpswap_fetch_get<AddressOverview>(`/info/wallet/overview?pid=${pid}`))?.data;
    }, [pid]),
    refresh,
  );
}
