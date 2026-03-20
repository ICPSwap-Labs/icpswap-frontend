import { setting } from "@icpswap/actor";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSettingMaintenance() {
  const result = await (await setting()).get_active_maintenance_pages();
  return result;
}

export function useSettingMaintenance(): UseQueryResult<Awaited<ReturnType<typeof getSettingMaintenance>>, Error> {
  return useQuery({
    queryKey: ["useSettingMaintenance"],
    queryFn: () => getSettingMaintenance(),
  });
}
