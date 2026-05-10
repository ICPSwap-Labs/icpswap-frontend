import type { Token } from "@icpswap/swap-sdk";
import { type TOKEN_STANDARD } from "@icpswap/types";
import { noApproveByTokenInsufficient, TokenInsufficient, useSwapApprove } from "hooks/swap/index";
import { useCallback } from "react";

export const useLimitApprove = () => {
  const approve = useSwapApprove();

  return useCallback(
    ({
      tokenInsufficient,
      amount,
      token,
      poolId,
    }: {
      amount: string;
      tokenInsufficient: TokenInsufficient | undefined;
      token: Token;
      poolId: string;
    }) => {
      return async () => {
        if (noApproveByTokenInsufficient(tokenInsufficient)) return true;

        if (amount !== "0") {
          return await approve({
            token,
            amount,
            poolId,
            standard: token.standard as TOKEN_STANDARD,
          });
        }

        return true;
      };
    },
    [approve],
  );
};
