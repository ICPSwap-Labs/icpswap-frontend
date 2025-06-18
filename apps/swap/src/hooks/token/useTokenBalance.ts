import { useCallback, useState, useEffect, useMemo } from "react";
import { Principal } from "@dfinity/principal";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { getTokenStandard } from "store/token/cache/hooks";
import { balanceAdapter, isNeedBalanceAdapter } from "utils/token/adapter";
import { ICP } from "@icpswap/tokens";
import {
  isPrincipal,
  isValidPrincipal,
  isOkSubAccount,
  principalToAccount,
  BigNumber,
  isUndefinedOrNull,
  nonUndefinedOrNull,
} from "@icpswap/utils";
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { icpAdapter, tokenAdapter, TOKEN_STANDARD } from "@icpswap/token-adapter";
import { useCallsData } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { useStateTokenBalanceManager } from "store/global/hooks";
import { getTokenBalanceKey } from "utils";

export async function getTokenBalance(canisterId: string, account: string | Principal, subAccount?: Uint8Array) {
  if (isNeedBalanceAdapter(canisterId)) return await balanceAdapter(canisterId, account);

  const standard = getTokenStandard(canisterId);

  if (standard === TOKEN_STANDARD.EXT) {
    let address = "";

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

export function useTokenBalance(
  canisterId: string | undefined,
  account: string | Principal | Null,
  refresh?: number | boolean | Null,
  sub?: Uint8Array,
) {
  const tokenKey = getTokenBalanceKey(canisterId, account?.toString(), sub);

  const [stateBalance, updateStateBalance] = useStateTokenBalanceManager(tokenKey);

  const { result: balance, loading } = useCallsData(
    useCallback(async () => {
      if (!account || !canisterId) return undefined;
      const result = await getTokenBalance(canisterId, account, sub);
      const balance = result && nonUndefinedOrNull(result.data) ? result.data.toString() : undefined;
      const tokenKey = getTokenBalanceKey(canisterId, account.toString(), sub);

      if (tokenKey && nonUndefinedOrNull(balance)) updateStateBalance(tokenKey, balance);

      return balance;
    }, [account, canisterId, sub, updateStateBalance]),
    refresh,
  );

  return useMemo(() => {
    return {
      loading: isUndefinedOrNull(stateBalance) ? loading : false,
      result: nonUndefinedOrNull(balance) ? balance.toString() : stateBalance,
    };
  }, [loading, balance, stateBalance, canisterId]);
}

export type Balances = {
  [key: string]: CurrencyAmount<Token>;
};

export function useCurrencyBalances(
  account: string | Principal | undefined,
  currencies: (Token | undefined | null)[],
  reload?: boolean,
) {
  const [balances, setBalances] = useState<Balances>({} as Balances);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && currencies && currencies.length) {
      setLoading(true);

      const queryPromise = currencies.map((token) => {
        if (token) {
          return getTokenBalance(token.address, account).then(
            (result) => new BigNumber(result ? result.toString() : "0"),
          );
        }

        return new Promise<BigNumber>((resolve) => resolve(new BigNumber(0)));
      });

      Promise.all(queryPromise).then((result: BigNumber[]) => {
        const balances = {} as Balances;

        result.forEach((balance: BigNumber, index: number) => {
          const token = currencies[index];

          if (token) {
            balances[token.address] = CurrencyAmount.fromRawAmount<Token>(token, balance ? balance.toString() : 0);
          }
        });

        setBalances(balances);
        setLoading(false);
      });
    }
  }, [currencies, account, reload]);

  return useMemo(
    () => ({
      loading,
      result: balances ?? {},
    }),
    [balances, loading],
  );
}

export function useCurrencyBalance(
  account: string | Principal | undefined,
  token: Token | undefined,
  refresh?: boolean | number,
) {
  const { loading, result } = useTokenBalance(token?.address, account, refresh);

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

export function useCurrencyBalanceV1(
  account: string | Principal | undefined,
  token: Token | undefined,
  refresh?: boolean | number,
) {
  const [storeResult, setStoreResult] = useState<string | undefined>(undefined);

  const { loading, result } = useTokenBalance(token?.address, account, refresh);

  useEffect(() => {
    if (nonUndefinedOrNull(result)) {
      setStoreResult(result);
    }
  }, [result]);

  return useMemo(() => {
    if (!token || isUndefinedOrNull(storeResult) || loading)
      return {
        loading,
        result: storeResult && token ? CurrencyAmount.fromRawAmount(token, storeResult) : undefined,
      };

    return {
      loading,
      result: CurrencyAmount.fromRawAmount(token, storeResult),
    };
  }, [loading, storeResult, token]);
}
