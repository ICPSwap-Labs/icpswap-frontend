import type { Token } from "@icpswap/swap-sdk";
import { type TOKEN_STANDARD } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";
import {
  getTokenActualDepositRawAmount,
  noDepositByTokenInsufficient,
  TokenInsufficient,
  useSwapDeposit,
} from "hooks/swap/index";
import { useCallback } from "react";
import type { ExternalTipArgs, OpenExternalTip } from "types/index";

export function useLimitDeposit() {
  const deposit = useSwapDeposit();

  return useCallback(
    ({
      token,
      tokenInsufficient,
      poolId,
      amount,
      unusedBalance,
      openExternalTip,
      stepKey,
    }: {
      token: Token;
      poolId: string;
      amount: string;
      tokenInsufficient: TokenInsufficient | undefined;
      unusedBalance: string;
      openExternalTip: OpenExternalTip;
      stepKey: string;
    }) => {
      return async () => {
        if (noDepositByTokenInsufficient(tokenInsufficient)) return true;
        if (amount === "0") return true;

        // Mins 1 token fee by backend, so the deposit amount should add 1 token fee if use deposit
        return await deposit({
          token,
          amount: getTokenActualDepositRawAmount(new BigNumber(amount).minus(unusedBalance).toString(), token),
          poolId,
          openExternalTip: ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey, poolId });
          },
          standard: token.standard as TOKEN_STANDARD,
        });
      };
    },
    [deposit],
  );
}
