import { SubAccount, Principal } from "@icpswap/dfinity";
import { getTokenBalance, getUserUnusedBalance, getUserWithdrawQueue } from "@icpswap/hooks";
import type { Pool } from "@icpswap/swap-sdk";
import type { Null, SwapPoolData, UserSwapPoolsBalance, UserWithdrawQueueInfo } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

export function useUnusedBalanceAndWithdrawQueue(pool: Pool | Null, refresh?: number | boolean) {
  const principal = useAccountPrincipalString();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<undefined | [UserSwapPoolsBalance[], UserWithdrawQueueInfo | undefined]>(
    undefined,
  );

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- reload dependencies
  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(principal) || isUndefinedOrNull(pool)) return;

      const pool_data = {
        fee: BigInt(pool.fee),
        key: "",
        tickSpacing: BigInt(pool.tickSpacing),
        token0: {
          address: pool.token0.address,
          standard: pool.token0.standard,
        },
        token1: {
          address: pool.token1.address,
          standard: pool.token1.standard,
        },
        canisterId: Principal.fromText(pool.id),
      } as SwapPoolData;

      const get_withdraw_queue = async () => {
        return await getUserWithdrawQueue(pool.id);
      };

      const get_un_deposit_balances = async () => {
        const sub = SubAccount.fromPrincipal(Principal.fromText(principal)).toUint8Array();

        const fetch_balance = async (token: { address: string; standard: string }) => {
          let result: bigint | undefined;

          try {
            const _result = token.standard.includes("DIP20")
              ? BigInt(0)
              : await getTokenBalance({
                  canisterId: token.address,
                  address: pool.id,
                  sub,
                });
            result = _result;
          } catch (err) {
            console.error(err);
          }

          return result ?? BigInt(0);
        };

        const result = await Promise.all([fetch_balance(pool.token0), fetch_balance(pool.token1)]);

        return {
          ...pool_data,
          type: "unDeposit",
          balance0: result[0],
          balance1: result[1],
        } as UserSwapPoolsBalance;
      };

      const get_un_used_balances = async () => {
        const result = await getUserUnusedBalance(pool.id, Principal.fromText(principal));

        return {
          ...pool_data,
          type: "unUsed",
          balance0: result?.balance0 ?? BigInt(0),
          balance1: result?.balance1 ?? BigInt(0),
        } as UserSwapPoolsBalance;
      };

      const callback: () => Promise<[UserSwapPoolsBalance[], UserWithdrawQueueInfo | undefined]> = async () => {
        const allResults = await Promise.all([get_un_deposit_balances(), get_un_used_balances(), get_withdraw_queue()]);
        return [(allResults[0] ? [allResults[0]] : []).concat(allResults[1] ?? []), allResults[2]];
      };

      setLoading(true);
      const result = await callback();
      setResult(result);
      setLoading(false);
    }

    call();
  }, [principal, pool, refresh]);

  return useMemo(() => ({ loading, result }), [loading, result]);
}
