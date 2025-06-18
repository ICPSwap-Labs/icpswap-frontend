import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

interface UseAddressAliasProps {
  principal?: string | Null;
  account?: string | Null;
  accountTextual?: string | Null;
}

export function useAddressAlias({ principal, account, accountTextual }: UseAddressAliasProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(principal) && isUndefinedOrNull(account) && isUndefinedOrNull(accountTextual))
        return undefined;

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

export interface GetAddressesAliasProps {
  principals?: string[];
  accounts?: string[];
}

export async function getAddressesAlias({ principals, accounts }: GetAddressesAliasProps) {
  const result = await icpswap_fetch_post<{ [key: string]: string }>("/info/address/alias/query", {
    pids: principals ?? [],
    accounts: accounts ?? [],
  });

  return result.data;
}

export function useAddressesAlias({ principals, accounts }: GetAddressesAliasProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(principals) && isUndefinedOrNull(accounts)) return undefined;
      return await getAddressesAlias({ principals, accounts });
    }, [principals, accounts]),
  );
}
