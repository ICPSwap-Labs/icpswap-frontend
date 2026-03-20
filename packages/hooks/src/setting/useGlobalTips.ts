import { setting } from "@icpswap/actor";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSettingGlobalTips() {
  const result = await (await setting()).get_global_notice();
  return result[0];
}

export function useSettingGlobalTips(): UseQueryResult<Awaited<ReturnType<typeof getSettingGlobalTips>>, Error> {
  return useQuery({
    queryKey: ["useSettingGlobalTips"],
    queryFn: () => getSettingGlobalTips(),
  });
}
