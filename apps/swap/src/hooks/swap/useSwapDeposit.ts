import { TOKEN_STANDARD } from "@icpswap/types";
import { Token, Pool } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { useSwapApprove, useSwapDeposit, useSwapTransfer } from "hooks/swap/index";
import { isUseTransfer } from "utils/token/index";
import { formatTokenAmount } from "@icpswap/utils";

export interface SwapDepositTokenBalanceArgs {
  amount: string;
  token: Token;
  pool: Pool;
}

export function useSwapDepositTokenBalance() {
  const principal = useAccountPrincipal();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();

  return useCallback(
    async ({ amount, token, pool }: SwapDepositTokenBalanceArgs) => {
      if (!principal) return undefined;

      const __amount = formatTokenAmount(amount, token.decimals).toFixed(0);

      const poolId = pool.id;

      const step0 = async () => {
        if (isUseTransfer(token)) {
          return await transfer(token, __amount, poolId);
        }

        return await approve({
          token,
          amount: __amount,
          poolId,
          standard: token.standard as TOKEN_STANDARD,
        });
      };

      const step1 = async () => {
        return await deposit({
          token,
          amount: __amount,
          poolId,
          standard: token.standard as TOKEN_STANDARD,
        });
      };

      const step0_result = await step0();

      if (step0_result) {
        return await step1();
      }

      return false;
    },
    [principal, deposit, transfer, approve],
  );
}
