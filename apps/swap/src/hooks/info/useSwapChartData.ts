import { useCallsData } from "@icpswap/hooks";
import { useCallback } from "react";
import { InfoGlobalRealTimeDataResponse } from "@icpswap/types";
import { icpswap_info_fetch_get } from "@icpswap/utils";

export function useGlobalProtocol() {
  return useCallsData(
    useCallback(async () => {
      const result = await icpswap_info_fetch_get<InfoGlobalRealTimeDataResponse>("/global/protocol");
      return result?.data;
    }, []),
  );
}
