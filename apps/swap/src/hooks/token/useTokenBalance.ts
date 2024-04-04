import { useCallback, useState, useEffect, useMemo } from "react";
import { Principal } from "@dfinity/principal";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { getTokenStandard } from "store/token/cache/hooks";
import { balanceAdapter, isNeedBalanceAdapter } from "utils/token/adapter";
import { ICP } from "constants/tokens";
import { isPrincipal, isValidPrincipal, isOkSubAccount, principalToAccount, BigNumber } from "@icpswap/utils";
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { icpAdapter, tokenAdapter } from "@icpswap/token-adapter";
import { TOKEN_STANDARD } from "@icpswap/types";
import { useLatestDataCall } from "../useCallsData";

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
  account: string | Principal | undefined,
  refresh?: number | boolean,
  subAccount?: Uint8Array,
) {
  return useLatestDataCall(
    useCallback(async () => {
      if (!account || !canisterId) return undefined;
      const result = await getTokenBalance(canisterId, account, subAccount);
      return new BigNumber(result ? result.data?.toString() ?? 0 : 0);
    }, [account, canisterId, subAccount]),
    refresh,
  );
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

      const queryPromise = currencies.map((currency) => {
        if (currency) {
          return getTokenBalance(currency.address, account).then(
            (result) => new BigNumber(result ? result.toString() : "0"),
          );
        }

        return new Promise<BigNumber>((resolve) => resolve(new BigNumber(0)));
      });

      Promise.all(queryPromise).then((result: BigNumber[]) => {
        const balances = {} as Balances;

        result.forEach((balance: BigNumber, index: number) => {
          const currency = currencies[index];

          if (currency) {
            balances[currency.address] = CurrencyAmount.fromRawAmount<Token>(
              currency,
              balance ? balance.toString() : 0,
            );
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
  currency: Token | undefined,
  refresh?: boolean,
) {
  const { loading, result } = useTokenBalance(currency?.address, account, refresh);

  return useMemo(() => {
    if (!currency || !result || loading || isNaN(result.toNumber()))
      return {
        loading,
        result: undefined,
      };

    return {
      loading,
      result: CurrencyAmount.fromRawAmount(currency, result.toNumber()),
    };
  }, [loading, result, currency]);
}
