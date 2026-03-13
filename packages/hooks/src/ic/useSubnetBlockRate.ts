import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

interface SubnetRateResult {
  block_rate: Array<[number, string]>;
}

interface UseSubtetBlockRateProps {
  subnet: string | Null;
}

export function useSubnetBlockRate({
  subnet,
}: UseSubtetBlockRateProps): UseQueryResult<SubnetRateResult | null | undefined, Error> {
  return useQuery({
    queryKey: ["useSubnetBlockRate", subnet],
    queryFn: async () => {
      if (isUndefinedOrNull(subnet)) return null;

      const fetch_result = await fetch(
        `https://ic-api.internetcomputer.org/api/v3/metrics/block-rate?subnet=${subnet}`,
      ).catch(() => undefined);

      if (!fetch_result) return undefined;

      return (await fetch_result.json()) as SubnetRateResult;
    },
    enabled: !isUndefinedOrNull(subnet),
  });
}
