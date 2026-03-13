import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { setting } from "@icpswap/actor";

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
