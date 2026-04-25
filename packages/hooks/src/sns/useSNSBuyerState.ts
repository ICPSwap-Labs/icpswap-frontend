import { Principal } from "@icpswap/dfinity";
import { sns_swap } from "@icpswap/actor";
import type { GetBuyerStateResponse, RefreshBuyerTokensResponse } from "@icpswap/types";
import { optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSNSBuyerState(swap_id: string, principal: string) {
  return resultFormat<GetBuyerStateResponse>(
    await (
      await sns_swap(swap_id)
    ).get_buyer_state({
      principal_id: optionalArg<Principal>(Principal.fromText(principal)),
    }),
  ).data;
}

export function useSNSBuyerState(
  swap_id: string | undefined,
  principal: string | undefined,
  reload?: boolean | number,
): UseQueryResult<GetBuyerStateResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useSNSBuyerState", swap_id, principal, reload],
    queryFn: async () => {
      if (!swap_id || !principal) return undefined;
      return await getSNSBuyerState(swap_id, principal);
    },
    enabled: !!swap_id && !!principal,
  });
}

export async function refreshSNSBuyerTokens(swap_id: string, buyer: string, confirmation_text?: string) {
  return resultFormat<RefreshBuyerTokensResponse>(
    await (
      await sns_swap(swap_id, true)
    ).refresh_buyer_tokens({
      buyer,
      confirmation_text: optionalArg<string>(confirmation_text),
    }),
  ).data;
}
