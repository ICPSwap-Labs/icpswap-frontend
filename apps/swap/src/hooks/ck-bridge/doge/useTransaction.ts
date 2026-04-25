import type { DogeTransaction } from "@icpswap/types";
import { fetch_get, isUndefinedOrNullOrEmpty } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";

export async function getDogeTransaction(tx: string) {
  const result = await fetch_get<DogeTransaction>(`https://api.blockchair.com/dogecoin/dashboards/transaction/${tx}`);
  return result?.data;
}

export function useTransaction(tx: string | undefined) {
  return useQuery({
    queryKey: ["dogeTransaction", tx],
    queryFn: () => {
      if (isUndefinedOrNullOrEmpty(tx)) return undefined;
      return getDogeTransaction(tx);
    },
    enabled: !!tx,
  });
}
