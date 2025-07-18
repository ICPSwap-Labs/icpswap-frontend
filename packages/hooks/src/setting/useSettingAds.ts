import { useCallback } from "react";
import { setting } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getSettingGlobalAds() {
  const result = await (await setting()).get_ads_page();
  return result?.[0];
}

export function useSettingGlobalAds() {
  return useCallsData(
    useCallback(async () => {
      return await getSettingGlobalAds();
    }, []),
  );
}
