import { useCallback } from "react";
import { stakingPoolWithdraw } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTips, MessageTypes } from "hooks/useTips";
import { getStepData } from "store/steps/hooks";

export interface UseWithdrawCallbackArgs {
  token: Token;
  poolId: string;
  key: string;
}

export function useRewardTokenWithdrawCall() {
  const [openTip] = useTips();

  return useCallback(async ({ token, poolId, key }: UseWithdrawCallbackArgs) => {
    const harvestAmount = getStepData<bigint | undefined>(key);

    // Skip withdraw is amount is 0 or undefined
    if (harvestAmount === undefined || harvestAmount === BigInt(0)) {
      return "skip";
    }

    const { status, message } = await stakingPoolWithdraw(poolId, false, harvestAmount);

    if (status === "err") {
      openTip(`Failed to withdraw ${token.symbol}: ${message}`, MessageTypes.error);
      return false;
    }

    return true;
  }, []);
}
