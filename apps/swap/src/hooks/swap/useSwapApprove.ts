import { useCallback } from "react";
import { Token } from "@icpswap/swap-sdk";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { approve } from "hooks/token/useApprove";
import { useAccountPrincipal } from "store/auth/hooks";
import { useMultipleApproveManager } from "store/swap/cache/hooks";
import { allowance } from "hooks/token/useAllowance";

export function useSwapApprove() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const { multipleApprove } = useMultipleApproveManager();

  return useCallback(
    async (token: Token, amount: string, poolId: string, options?: TIP_OPTIONS) => {
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
