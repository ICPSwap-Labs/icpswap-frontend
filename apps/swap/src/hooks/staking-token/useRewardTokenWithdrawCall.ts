import { stakingPoolWithdraw } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback } from "react";
import { getStepData } from "store/steps/hooks";

export interface UseWithdrawCallbackArgs {
  token: Token;
  poolId: string;
  key: string;
}

export function useRewardTokenWithdrawCall() {
  const [openTip] = useTips();

  return useCallback(
    async ({ token, poolId, key }: UseWithdrawCallbackArgs) => {
      const harvestAmount = getStepData<bigint | undefined>(key);

      // Skip withdraw is amount is 0 or undefined or amount is less than transfer fee
      if (harvestAmount === undefined || harvestAmount === BigInt(0) || harvestAmount <= token.transFee) {
        return "skip";
      }

      const { status, message } = await stakingPoolWithdraw(poolId, false, harvestAmount);

      if (status === "err") {
        openTip(`Failed to withdraw ${token.symbol}: ${message}`, MessageTypes.error);
        return false;
      }

      return true;
    },
    [openTip],
  );
}
