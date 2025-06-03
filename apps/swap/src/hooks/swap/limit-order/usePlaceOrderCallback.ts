import { Token, Position } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { OpenExternalTip } from "types/index";
import { useStepManager } from "hooks/swap/limit-order/useStepManager";
import { usePlaceOrderCalls } from "hooks/swap/limit-order/usePlaceOrderCalls";

export interface PlaceOrderCallbackArgs {
  position: Position;
  openExternalTip: OpenExternalTip;
  token0Balance: string;
  token1Balance: string;
  token0SubAccountBalance: string;
  token1SubAccountBalance: string;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
  refresh: () => void;
  limitLick: bigint;
  inputToken: Token;
}

export function usePlaceOrderCallback() {
  const createCalls = usePlaceOrderCalls();
  const createCall = useStepCalls();
  const manageStep = useStepManager();

  return useCallback(
    ({
      position,
      token0Balance,
      token0SubAccountBalance,
      token1Balance,
      token1SubAccountBalance,
      openExternalTip,
      unusedBalance,
      limitLick,
      inputToken,
    }: PlaceOrderCallbackArgs) => {
      const key = newStepKey();

      const calls = createCalls({
        position,
        token0Balance,
        token0SubAccountBalance,
        token1Balance,
        token1SubAccountBalance,
        stepKey: key,
        unusedBalance,
        openExternalTip,
        limitLick,
      });

      const { call, reset, retry } = createCall(calls, key.toString());

      manageStep({ position, inputToken, key, retry });

      return { call, reset, retry, key };
    },
    [createCalls, createCall, manageStep],
  );
}
