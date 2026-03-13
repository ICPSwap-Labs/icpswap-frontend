import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { setting } from "@icpswap/actor";

export async function getSettingGlobalAds() {
  const result = await (await setting()).get_ads_page();
  return result?.[0];
}

export function useSettingGlobalAds(): UseQueryResult<Awaited<ReturnType<typeof getSettingGlobalAds>>, Error> {
  return useQuery({
    queryKey: ["useSettingGlobalAds"],
    queryFn: () => getSettingGlobalAds(),
  });
}
