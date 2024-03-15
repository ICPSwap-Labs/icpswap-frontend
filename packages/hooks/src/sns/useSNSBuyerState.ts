import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_swap } from "@icpswap/actor";
import type {
  GetBuyerStateResponse,
  RefreshBuyerTokensResponse,
} from "@icpswap/types";
import { useCallback } from "react";
import { Principal } from "@dfinity/principal";

export async function getSNSBuyerState(swap_id: string, principal: string) {
  return resultFormat<GetBuyerStateResponse>(
    await (
      await sns_swap(swap_id)
    ).get_buyer_state({
      principal_id: availableArgsNull<Principal>(Principal.fromText(principal)),
    })
  ).data;
}

export function useSNSBuyerState(
  swap_id: string | undefined,
  principal: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!swap_id || !principal) return undefined;
      return await getSNSBuyerState(swap_id, principal);
    }, [swap_id, principal]),
    reload
  );
}

export async function refreshSNSBuyerTokens(
  swap_id: string,
  buyer: string,
  confirmation_text?: string
) {
  return resultFormat<RefreshBuyerTokensResponse>(
    await (
      await sns_swap(swap_id, true)
    ).refresh_buyer_tokens({
      buyer,
      confirmation_text: availableArgsNull<string>(confirmation_text),
    })
  ).data;
}
