import { type UseQueryResult, useQuery } from "@tanstack/react-query";

const INTERNET_COMPUTER_BASE = "https://ic-api.internetcomputer.org/api/v3";

export function useIcpBlocks(): UseQueryResult<
  { blocks: number; secondBlocks: number } | { blocks: undefined; secondBlocks: undefined },
  Error
> {
  return useQuery({
    queryKey: ["useIcpBlocks"],
    queryFn: async () => {
      const fetch_result = await fetch(`${INTERNET_COMPUTER_BASE}/metrics/block-rate`).catch(() => undefined);

      if (!fetch_result) return { blocks: undefined, secondBlocks: undefined };

      const result = (await fetch_result.json()) as {
        block_rate: [number, number][];
      };

      return {
        blocks: result.block_rate[0][0],
        secondBlocks: result.block_rate[0][1],
      };
    },
  });
}
