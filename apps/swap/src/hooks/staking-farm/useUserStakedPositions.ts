import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useUserFarms, getFarmUserTVL, useInfoAllTokens } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { FarmUserTvl } from "@icpswap/types";
import { nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useTokens } from "hooks/useCurrency";

export function useUserStakedPositions() {
  const principal = useAccountPrincipal();

  const [allFarmsUserTvl, setAllFarmsUserTvl] = useState<FarmUserTvl[] | null>(null);

  const infoAllTokens = useInfoAllTokens();
  const { result: farms } = useUserFarms(principal?.toString());

  useEffect(() => {
    async function call() {
      if (farms && principal) {
        const result = (
          await Promise.all(
            farms.map(async (farmId) => {
              return await getFarmUserTVL(farmId.toString(), principal.toString());
            }),
          )
        ).flat();

        setAllFarmsUserTvl(result);
      }
    }

    call();
  }, [farms, principal]);

  const allTokenIds = useMemo(() => {
    if (!allFarmsUserTvl) return [];
    return [...new Set(allFarmsUserTvl.map((e) => [e.poolToken0.address, e.poolToken1.address]).flat())];
  }, [allFarmsUserTvl]);

  const tokens = useTokens(allTokenIds);

  const tvl: string | undefined = useMemo(() => {
    if (!allFarmsUserTvl || !infoAllTokens) return undefined;

    let tvl: BigNumber = new BigNumber(0);

    for (let i = 0; i < allFarmsUserTvl.length; i++) {
      const userTvl = allFarmsUserTvl[i];

      const {
        poolToken0: { amount: token0Amount, address: token0Address },
        poolToken1: { amount: token1Amount, address: token1Address },
      } = userTvl;

      const token0 = tokens.find((e) => e[1]?.address === token0Address)?.[1];
      const token1 = tokens.find((e) => e[1]?.address === token1Address)?.[1];

      const token0USDPrice = infoAllTokens.find((info) => info.address === token0Address)?.priceUSD;
      const token1USDPrice = infoAllTokens.find((info) => info.address === token1Address)?.priceUSD;

      if (
        nonUndefinedOrNull(token0USDPrice) &&
        nonUndefinedOrNull(token1USDPrice) &&
        nonUndefinedOrNull(token0) &&
        nonUndefinedOrNull(token1)
      ) {
        tvl = tvl
          .plus(parseTokenAmount(token0Amount, token0.decimals).multipliedBy(token0USDPrice))
          .plus(parseTokenAmount(token1Amount, token1.decimals).multipliedBy(token1USDPrice));
      }
    }

    return tvl.toString();
  }, [allFarmsUserTvl, infoAllTokens, tokens]);

  return useMemo(() => ({ tvl, farms }), [tvl, farms]);
}
