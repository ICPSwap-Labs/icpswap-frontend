import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import type { Null } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

interface UseAddressAliasProps {
  principal?: string | Null;
  account?: string | Null;
  accountTextual?: string | Null;
}

export function useAddressAlias({
  principal,
  account,
  accountTextual,
}: UseAddressAliasProps): UseQueryResult<string | undefined, Error> {
  const hasInput = !isUndefinedOrNull(principal) || !isUndefinedOrNull(account) || !isUndefinedOrNull(accountTextual);
  return useQuery({
    queryKey: ["useAddressAlias", principal, account, accountTextual],
    queryFn: async () => {
      if (isUndefinedOrNull(principal) && isUndefinedOrNull(account) && isUndefinedOrNull(accountTextual))
        return undefined;

      const result = await icpswap_fetch_post<string>(`/info/address/alias`, {
        principal,
        accountId: account,
        accountTextual,
      });

      if (isUndefinedOrNull(result)) return undefined;

      return result.data;
    },
    enabled: hasInput,
  });
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

export function useAddressesAlias({
  principals,
  accounts,
}: GetAddressesAliasProps): UseQueryResult<{ [key: string]: string } | undefined, Error> {
  const hasInput = !isUndefinedOrNull(principals) || !isUndefinedOrNull(accounts);
  return useQuery({
    queryKey: ["useAddressesAlias", principals, accounts],
    queryFn: async () => {
      if (isUndefinedOrNull(principals) && isUndefinedOrNull(accounts)) return undefined;
      return await getAddressesAlias({ principals, accounts });
    },
    enabled: hasInput,
  });
}
