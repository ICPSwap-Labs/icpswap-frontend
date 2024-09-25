import { isNullArgs, parseTokenAmount } from "@icpswap/utils";
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
    if (isNullArgs(pool)) return { token0: undefined, token1: undefined, poolId: undefined };

    return { token0: pool.token0, token1: pool.token1, poolId: pool.id };
  }, [pool]);

  const { result: token0Balance } = useTokenBalance({ address: poolId, canisterId: token0?.address });
  const { result: token1Balance } = useTokenBalance({ address: poolId, canisterId: token1?.address });

  return useMemo(() => {
    if (
      isNullArgs(infoAllTokens) ||
      isNullArgs(token0Balance) ||
      isNullArgs(token1Balance) ||
      isNullArgs(token0) ||
      isNullArgs(token1)
    )
      return undefined;

    const infoToken0 = infoAllTokens.find((e) => e.address === token0.address);
    const infoToken1 = infoAllTokens.find((e) => e.address === token1.address);

    if (isNullArgs(infoToken0) || isNullArgs(infoToken1)) return undefined;

    return parseTokenAmount(token0Balance, token0.decimals)
      .multipliedBy(infoToken0.priceUSD)
      .plus(parseTokenAmount(token1Balance, token1.decimals).multipliedBy(infoToken1.priceUSD))
      .toString();
  }, [infoAllTokens, token0Balance, token1Balance, token0, token1]);
}
