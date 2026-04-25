import { useInfoAllTokens } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { useIntervalFarmUserTVL } from "hooks/staking-farm/useIntervalFarmUserTVL";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

export interface UseUserTvlProps {
  token0?: Token | undefined;
  token1?: Token | undefined;
  farmId: string;
}

export function useUserTvlValue({ farmId, token0, token1 }: UseUserTvlProps) {
  const principal = useAccountPrincipalString();
  const infoAllTokens = useInfoAllTokens();

  const { data: userTvl } = useIntervalFarmUserTVL(farmId, principal);

  const userTvlValue = useMemo(() => {
    if (!userTvl || !token0 || !token1 || !infoAllTokens || infoAllTokens.length === 0) return undefined;

    const { poolToken0, poolToken1 } = userTvl;

    const token0Price = infoAllTokens.find((e) => e.tokenLedgerId === token0.address)?.price;
    const token1Price = infoAllTokens.find((e) => e.tokenLedgerId === token1.address)?.price;

    if (!token0Price || !token1Price) return undefined;

    const token0Tvl = parseTokenAmount(poolToken0.amount, token0.decimals).multipliedBy(token0Price);
    const token1Tvl = parseTokenAmount(poolToken1.amount, token1.decimals).multipliedBy(token1Price);

    return token0Tvl.plus(token1Tvl).toString();
  }, [userTvl, infoAllTokens, token0, token1]);

  return useMemo(() => userTvlValue, [userTvlValue]);
}
