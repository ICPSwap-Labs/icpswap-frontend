import { Principal, AccountIdentifier, SubAccount } from "@icpswap/dfinity";
import { CurrencyAmount, type Token } from "@icpswap/swap-sdk";
import { icpAdapter, TOKEN_STANDARD, tokenAdapter } from "@icpswap/token-adapter";
import { ICP } from "@icpswap/tokens";
import type { Null } from "@icpswap/types";
import {
  isOkSubAccount,
  isPrincipal,
  isUndefinedOrNull,
  isValidPrincipal,
  nonUndefinedOrNull,
  principalToAccount,
  toHexString,
} from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { getTokenStandard } from "store/token/cache/hooks";
import { balanceAdapter, isNeedBalanceAdapter } from "utils/token/adapter";

export async function getTokenBalance(canisterId: string, account: string | Principal, subAccount?: Uint8Array) {
  if (isNeedBalanceAdapter(canisterId)) return await balanceAdapter(canisterId, account);

  const standard = getTokenStandard(canisterId);

  if (standard === TOKEN_STANDARD.EXT) {
    let address: string | undefined;

    if (!subAccount) {
      if (isPrincipal(account)) {
        address = principalToAccount(account.toString());
      } else if (isValidPrincipal(account)) {
        address = principalToAccount(account);
      } else {
        address = account;
      }
    } else {
      const sub = SubAccount.fromBytes(subAccount);

      if (isOkSubAccount(sub)) {
        if (isPrincipal(account)) {
          address = AccountIdentifier.fromPrincipal({
            principal: account,
            subAccount: sub,
          }).toHex();
        } else if (isValidPrincipal(account)) {
          address = AccountIdentifier.fromPrincipal({
            principal: Principal.fromText(account),
            subAccount: sub,
          }).toHex();
        }
      }
    }

    return await tokenAdapter.balance({
      canisterId,
      params: {
        user: { address },
        token: "",
      },
    });
  }

  if (canisterId === ICP.address) {
    return await icpAdapter.balance({
      canisterId,
      params: {
        user: isPrincipal(account)
          ? { principal: account }
          : isValidPrincipal(account)
            ? { principal: Principal.fromText(account) }
            : { address: account },
        token: "",
        subaccount: subAccount ? [...subAccount] : undefined,
      },
    });
  }

  return await tokenAdapter.balance({
    canisterId,
    params: {
      user: isPrincipal(account)
        ? { principal: account }
        : isValidPrincipal(account)
          ? { principal: Principal.fromText(account) }
          : { address: account },
      token: "",
      subaccount: subAccount ? [...subAccount] : undefined,
    },
  });
}

export function useTokenBalance({
  tokenId,
  account,
  refresh,
  sub,
  refetchInterval,
}: {
  tokenId: string | undefined;
  account: string | Principal | Null;
  refresh?: number | Null;
  refetchInterval?: number;
  sub?: Uint8Array;
}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getTokenBalance", refresh, tokenId, account, sub ? toHexString(sub) : ""],
    queryFn: async () => {
      if (!account || !tokenId) return null;
      const result = await getTokenBalance(tokenId, account, sub);
      const balance = result && nonUndefinedOrNull(result.data) ? result.data.toString() : null;
      return balance;
    },
    enabled: nonUndefinedOrNull(account) && nonUndefinedOrNull(tokenId),
    refetchInterval,
  });

  return useMemo(() => {
    return {
      loading: isUndefinedOrNull(data) ? isLoading : false,
      result: data?.toString(),
      refetch,
    };
  }, [isLoading, data, refetch]);
}

export function useActiveUserTokenBalance({
  tokenId,
  refresh,
  sub,
  refetchInterval,
}: {
  tokenId: string | undefined;
  refresh?: number | Null;
  sub?: Uint8Array;
  refetchInterval?: number;
}) {
  const principal = useAccountPrincipalString();

  return useTokenBalance({
    tokenId,
    account: principal,
    refresh,
    sub,
    refetchInterval,
  });
}

export function useCurrencyBalance(
  account: string | Principal | undefined,
  token: Token | undefined,
  refresh?: number,
) {
  const { loading, result } = useTokenBalance({ tokenId: token?.address, account, refresh });

  return useMemo(() => {
    if (isUndefinedOrNull(result) || loading || !token)
      return {
        loading,
        result: undefined,
      };

    return {
      loading,
      result: CurrencyAmount.fromRawAmount(token, result),
    };
  }, [loading, result, token]);
}
