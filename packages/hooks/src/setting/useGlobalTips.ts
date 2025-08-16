import { useCallback } from "react";
import { setting } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getSettingGlobalTips() {
  const result = await (await setting()).get_global_notice();
  return result[0];
}

export function useSettingGlobalTips() {
  return useCallsData(
    useCallback(async () => {
      return await getSettingGlobalTips();
    }, []),
  );
}
