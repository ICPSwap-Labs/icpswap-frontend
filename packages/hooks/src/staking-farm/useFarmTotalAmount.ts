import { farmIndex } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getFarmTotalAmount() {
  const farmResult = await (await farmIndex()).getTotalAmount();
  return resultFormat<{ farmAmount: bigint; principalAmount: bigint }>(farmResult).data;
}

export function useFarmTotalAmount(
  reload?: boolean,
): UseQueryResult<{ farmAmount: bigint; principalAmount: bigint } | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmTotalAmount", reload],
    queryFn: async () => {
      return await getFarmTotalAmount();
    },
  });
}
