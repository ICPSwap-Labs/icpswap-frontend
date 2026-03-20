import { setting } from "@icpswap/actor";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getGlobalSettingChart() {
  const result = await (await setting()).get_default_chart_type();
  if (result) return Object.keys(result)[0];
  return undefined;
}

export function useGlobalSettingChart(): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["useGlobalSettingChart"],
    queryFn: () => getGlobalSettingChart(),
  });
}
