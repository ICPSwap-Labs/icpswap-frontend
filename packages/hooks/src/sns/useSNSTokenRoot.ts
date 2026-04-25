import type { TokenRoots } from "@icpswap/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useSNSTokensRootIds(): UseQueryResult<
  { data: TokenRoots[]; total_snses: number; max_sns_index: number } | undefined,
  Error
> {
  return useQuery({
    queryKey: ["useSNSTokensRootIds"],
    queryFn: async () => {
      const fetch_result = await fetch(
        "https://sns-api.internetcomputer.org/api/v1/snses?include_swap_lifecycle=LIFECYCLE_PENDING&include_swap_lifecycle=LIFECYCLE_ADOPTED&include_swap_lifecycle=LIFECYCLE_OPEN&include_swap_lifecycle=LIFECYCLE_COMMITTED",
      ).catch(() => undefined);

      if (!fetch_result) return undefined;

      return (await fetch_result.json()) as {
        data: TokenRoots[];
        total_snses: number;
        max_sns_index: number;
      };
    },
  });
}
