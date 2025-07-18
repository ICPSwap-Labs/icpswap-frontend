import { useCallback } from "react";
import { setting } from "@icpswap/actor";
import { useCallsData } from "../useCallData";

export async function getSettingMaintenance() {
  const result = await (await setting()).get_active_maintenance_pages();
  return result;
}

export function useSettingMaintenance() {
  return useCallsData(
    useCallback(async () => {
      return await getSettingMaintenance();
    }, []),
  );
}
