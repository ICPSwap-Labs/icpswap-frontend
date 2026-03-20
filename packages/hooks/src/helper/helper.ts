import type { Null } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export interface GetHelperUserTokensProps {
  principal: string;
}

export async function getUserTokens({ principal }: GetHelperUserTokensProps) {
  return (
    await icpswap_fetch_post<{
      user: string;
      totalBalance: number;
      tokens: Array<{ token: string; balance: number }>;
    }>("/info/wallet/user/all", {
      pid: principal,
    })
  ).data;
}

export interface UseHelperUserTokensProps {
  principal: string | Null;
  refresh?: number;
}

export function useUserTokens({
  principal,
  refresh,
}: UseHelperUserTokensProps): UseQueryResult<Awaited<ReturnType<typeof getUserTokens>> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserTokens", principal, refresh],
    queryFn: async () => {
      if (isUndefinedOrNull(principal)) return undefined;
      return await getUserTokens({ principal });
    },
    enabled: !isUndefinedOrNull(principal),
  });
}
