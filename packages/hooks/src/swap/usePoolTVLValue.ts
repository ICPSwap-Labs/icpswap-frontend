import { isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useMemo } from "react";
import { type Null } from "@icpswap/types";
import { Pool, Token } from "@icpswap/swap-sdk";

import { useInfoAllTokens } from "../info";
import { useTokenBalance } from "../token";

export interface UsePoolTVLValueProps {
  pool: Pool | Null;
}

export function usePoolTVLValue({ pool }: UsePoolTVLValueProps): string | undefined {
  const infoAllTokens = useInfoAllTokens();

  const {
    token0,
    token1,
    poolId,
  }: { token0: Token | undefined; token1: Token | undefined; poolId: string | undefined } = useMemo(() => {
    if (isUndefinedOrNull(pool)) return { token0: undefined, token1: undefined, poolId: undefined };

    return { token0: pool.token0, token1: pool.token1, poolId: pool.id };
  }, [pool]);

  const { result: token0Balance } = useTokenBalance({ address: poolId, canisterId: token0?.address });
  const { result: token1Balance } = useTokenBalance({ address: poolId, canisterId: token1?.address });

  return useMemo(() => {
    if (
      isUndefinedOrNull(infoAllTokens) ||
      isUndefinedOrNull(token0Balance) ||
      isUndefinedOrNull(token1Balance) ||
      isUndefinedOrNull(token0) ||
      isUndefinedOrNull(token1)
    )
      return undefined;

    const infoToken0 = infoAllTokens.find((e) => e.tokenLedgerId === token0.address);
    const infoToken1 = infoAllTokens.find((e) => e.tokenLedgerId === token1.address);

    if (isUndefinedOrNull(infoToken0) || isUndefinedOrNull(infoToken1)) return undefined;

    return parseTokenAmount(token0Balance, token0.decimals)
      .multipliedBy(infoToken0.price)
      .plus(parseTokenAmount(token1Balance, token1.decimals).multipliedBy(infoToken1.price))
      .toString();
  }, [infoAllTokens, token0Balance, token1Balance, token0, token1]);
}
