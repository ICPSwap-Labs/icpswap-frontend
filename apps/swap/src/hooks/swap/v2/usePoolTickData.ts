import { FeeAmount, Token } from "@icpswap/swap-sdk";
import { useLiquidityTicks } from "hooks/swap/v2/useSwapCalls";
import { usePoolCanisterId } from "hooks/swap/v2/index";

export function useAllTicks(token0: Token | undefined, token1: Token | undefined, feeAmount: FeeAmount) {
  const poolCanisterId = usePoolCanisterId(token0?.address, token1?.address, feeAmount);

  return useLiquidityTicks(poolCanisterId);
}
