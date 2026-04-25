import { setting } from "@icpswap/actor";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getGlobalSettingTokens() {
  const result = await (await setting()).get_default_tokens();
  return result;
}

export function useGlobalSettingTokens(): UseQueryResult<Awaited<ReturnType<typeof getGlobalSettingTokens>>, Error> {
  return useQuery({
    queryKey: ["useGlobalSettingTokens"],
    queryFn: () => getGlobalSettingTokens(),
  });
}
