import type { Token } from "@icpswap/swap-sdk";
import type { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { allowance } from "hooks/token/useAllowance";
import { approve } from "hooks/token/useApprove";
import { type TIP_OPTIONS, useErrorTip } from "hooks/useTips";
import { useCallback } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { useMultipleApproveManager } from "store/swap/cache/hooks";

export interface UseSwapApproveArgs {
  token: Token;
  amount: string;
  poolId: string;
  options?: TIP_OPTIONS;
  // Because some tokens has different standard in different pools, so need to pass standard here
  standard: TOKEN_STANDARD | string;
}

export function useSwapApprove() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const { multipleApprove } = useMultipleApproveManager();

  return useCallback(
    async ({ token, amount, poolId, options, standard }: UseSwapApproveArgs) => {
      if (!principal) return false;

      const allowedBalance = await allowance({
        canisterId: token.address,
        owner: principal.toString(),
        spender: poolId,
      });

      const multipleApproveAmount = (BigInt(amount) * BigInt(multipleApprove)).toString();

      if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(amount) > allowedBalance) {
        const { status, message } = await approve({
          canisterId: token.address,
          spender: poolId,
          value: multipleApproveAmount,
          account: principal,
          standard: standard as TOKEN_STANDARD,
        });

        if (status === "err") {
          openErrorTip(`Failed to approve ${token.symbol}: ${message}`, options);
          return false;
        }

        return true;
      }

      return true;
    },
    [approve, principal, multipleApprove],
  );
}
