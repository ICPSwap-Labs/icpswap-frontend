import { useCallback } from "react";
import { setting } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getGlobalSettingChart() {
  const result = await (await setting()).get_default_chart_type();
  if (result) return Object.keys(result)[0];
  return undefined;
}

export function useGlobalSettingChart() {
  return useCallsData(
    useCallback(async () => {
      return await getGlobalSettingChart();
    }, []),
  );
}
