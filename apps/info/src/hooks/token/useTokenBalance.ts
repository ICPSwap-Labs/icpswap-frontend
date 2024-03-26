import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";
import { tokenAdapter } from "@icpswap/token-adapter";
import { isNeedBalanceAdapter, balanceAdapter } from "utils/token/adapter";
import { Principal } from "@dfinity/principal";
import { isPrincipal, isValidPrincipal } from "@icpswap/utils";
import BigNumber from "bignumber.js";

export async function getTokenBalance(canisterId: string, account: string | Principal, subaccount?: number[]) {
  if (isNeedBalanceAdapter(canisterId)) return (await balanceAdapter(canisterId, account, subaccount)).data;

  return (
    await tokenAdapter.balance({
      canisterId,
      params: {
        user: isPrincipal(account)
          ? { principal: account }
          : isValidPrincipal(account)
          ? { principal: Principal.fromText(account) }
          : { address: account },
        token: "",
        subaccount,
      },
    })
  ).data;
}

export function useTokenBalance(
  canisterId: string | undefined,
  account: string | Principal | undefined,
  refresh?: boolean | number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !account) return undefined;

      const balance = await getTokenBalance(canisterId, account);
      return balance ? new BigNumber(balance.toString()) : undefined;
    }, [account, canisterId]),

    refresh,
  );
}
