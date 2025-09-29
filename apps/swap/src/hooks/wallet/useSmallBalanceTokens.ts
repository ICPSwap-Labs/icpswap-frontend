import { useEffect, useMemo, useState } from "react";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { useInfoAllTokens, getTokenBalance, getPromisesAwait, quote } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { __getTokenInfo } from "hooks/token";
import { useGlobalContext } from "hooks/useGlobalContext";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";

export type SmallBalanceResult = {
  balance: bigint;
  token: Token;
  icpAmount: bigint;
  poolId: string;
};

export function useSmallBalanceTokens() {
  const [loading, setLoading] = useState<boolean>(false);
  const { taggedTokens } = useTaggedTokenManager();
  const principal = useAccountPrincipalString();
  const infoAllTokens = useInfoAllTokens();
  const { AllPools } = useGlobalContext();

  const [balancesResult, setBalancesResult] = useState<Array<SmallBalanceResult | undefined> | undefined>(undefined);

  useEffect(() => {
    async function call() {
      setBalancesResult(undefined);

      if (
        taggedTokens &&
        taggedTokens.length > 0 &&
        nonUndefinedOrNull(principal) &&
        nonUndefinedOrNull(AllPools) &&
        AllPools.length > 0
      ) {
        setLoading(true);

        try {
          const calls = taggedTokens.map(async (tokenId) => {
            const tokenInfo = await __getTokenInfo(tokenId);
            if (isUndefinedOrNull(tokenInfo)) return undefined;

            const pool = AllPools.find((pool) => {
              return pool.key.includes(`${ICP.address}_${tokenId}`) || pool.key.includes(`${tokenId}_${ICP.address}`);
            });

            if (isUndefinedOrNull(pool)) return undefined;

            const { token0, token1 } = pool;
            const standardFromPool = token0.address === tokenId ? token0.standard : token1.standard;

            const token = new Token({
              address: tokenInfo.canisterId,
              decimals: tokenInfo.decimals,
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              standard: standardFromPool ?? tokenInfo.standardType,
              logo: tokenInfo.logo,
              transFee: Number(tokenInfo.transFee),
            });

            const balance = await getTokenBalance({ canisterId: tokenId, address: principal });
            if (isUndefinedOrNull(balance)) return undefined;

            const icpAmount = await quote(pool.canisterId.toString(), {
              amountIn: balance.toString(),
              amountOutMinimum: "0",
              zeroForOne: tokenId < ICP.address,
            });

            return {
              token,
              balance,
              icpAmount,
              poolId: pool.canisterId.toString(),
            };
          });

          const allBalances = await getPromisesAwait<SmallBalanceResult | undefined>(calls, 10);

          setBalancesResult(allBalances);
        } catch (error) {
          console.error("fetch small balances: ", error);
        }

        setLoading(false);
      }
    }

    call();
  }, [AllPools, taggedTokens, principal]);

  const result = useMemo(() => {
    if (isUndefinedOrNull(balancesResult) || isUndefinedOrNull(infoAllTokens)) return undefined;

    return taggedTokens.map((tokenId, index) => {
      const infoToken = infoAllTokens.find((info) => info.tokenLedgerId === tokenId);
      if (isUndefinedOrNull(infoToken)) return undefined;

      const smallBalanceResult = balancesResult[index];
      if (isUndefinedOrNull(smallBalanceResult)) return undefined;

      return { tokenId, smallBalanceResult, infoToken };
    });
  }, [balancesResult, taggedTokens, infoAllTokens]);

  const filteredResult = useMemo(() => {
    if (isUndefinedOrNull(result)) return undefined;
    return result.filter((element) => nonUndefinedOrNull(element));
  }, [result]);

  return useMemo(
    () => ({
      loading,
      result: filteredResult,
    }),
    [loading, filteredResult],
  );
}
