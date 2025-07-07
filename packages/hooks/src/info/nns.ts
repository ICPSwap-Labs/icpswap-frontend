import { useCallback } from "react";
import { icpswap_info_fetch_get } from "@icpswap/utils";
import { NnsTokenInfo } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getNnsTokensInfo() {
  return (await icpswap_info_fetch_get<Array<NnsTokenInfo>>(`/sns/list`)).data;
}

export function useNnsTokensInfo() {
  return useCallsData(
    useCallback(async () => {
      return await getNnsTokensInfo();
    }, []),
  );
}
