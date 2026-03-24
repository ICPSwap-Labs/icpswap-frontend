import { setting } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSettingMaintenance(): Promise<Array<[string, string]> | undefined> {
  return resultFormat<Array<[string, string]>>(await (await setting()).get_active_maintenance_pages()).data;
}

export function useSettingMaintenance(): UseQueryResult<Awaited<ReturnType<typeof getSettingMaintenance>>, Error> {
  return useQuery({
    queryKey: ["useSettingMaintenance"],
    queryFn: () => getSettingMaintenance(),
  });
}
