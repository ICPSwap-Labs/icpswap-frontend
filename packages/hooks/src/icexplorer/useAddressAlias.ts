import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { icpswap_fetch_post, isNullArgs } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

interface UseAddressAliasProps {
  principal?: string | Null;
  account?: string | Null;
  accountTextual?: string | Null;
}

export function useAddressAlias({ principal, account, accountTextual }: UseAddressAliasProps) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(principal) && isNullArgs(account) && isNullArgs(accountTextual)) return undefined;

      return (
        await icpswap_fetch_post<string>(`/info/address/alias`, {
          principal,
          accountId: account,
          accountTextual,
        })
      ).data;
    }, [principal, account, accountTextual]),
  );
}
