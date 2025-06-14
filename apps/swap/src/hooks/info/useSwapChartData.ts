import { useCallsData } from "@icpswap/hooks";
import { useCallback } from "react";
import { InfoGlobalRealTimeDataResponse } from "@icpswap/types";
import { icpswap_info_fetch_get } from "@icpswap/utils";

export function useGlobalProtocol() {
  return useCallsData(
    useCallback(async () => {
      return (await icpswap_info_fetch_get<InfoGlobalRealTimeDataResponse>("/global/protocol")).data;
    }, []),
  );
}
