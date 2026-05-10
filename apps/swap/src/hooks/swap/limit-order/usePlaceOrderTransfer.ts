import type { Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";
import {
  getTokenActualTransferRawAmount,
  noTransferByTokenInsufficient,
  TokenInsufficient,
  useSwapTransfer,
} from "hooks/swap/index";
import { useCallback } from "react";

export function useLimitTransfer() {
  const transfer = useSwapTransfer();

  return useCallback(
    ({
      token,
      tokenInsufficient,
      amount,
      poolId,
      unusedBalance,
      subAccountBalance,
    }: {
      token: Token;
      poolId: string;
      amount: string;
      tokenInsufficient: TokenInsufficient | undefined;
      unusedBalance: string;
      subAccountBalance: string;
    }) => {
      return async () => {
        if (noTransferByTokenInsufficient(tokenInsufficient)) return true;

        if (amount !== "0") {
          return await transfer(
            token,
            getTokenActualTransferRawAmount(
              new BigNumber(amount).minus(unusedBalance).minus(subAccountBalance).toString(),
              token,
            ),
            poolId,
          );
        }

        return true;
      };
    },
    [transfer],
  );
}
