import { useEffect, useMemo, useState } from "react";
import { useStakePools, useInfoAllTokens } from "@icpswap/hooks";
import { StakingState } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { BigNumber, parseTokenAmount } from "@icpswap/utils";
import { getStateValue } from "utils/stake/index";
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { useTokensInfo } from "hooks/token";

export function useUserAvailableTokensValue() {
  const principal = useAccountPrincipal();

  const [usdValue, setUSDValue] = useState<null | string>(null);
  const [availableTokens, setAvailableTokens] = useState<null | number>(null);

  const infoAllTokens = useInfoAllTokens();

  const { result: pools } = useStakePools({ state: getStateValue(StakingState.LIVE), offset: 0, limit: 10000 });

  const allAvailableStakeTokens = useMemo(() => {
    if (!pools) return [];
    // Filter the same token id
    return [...new Set(pools.content.map((e) => e.stakingToken.address))];
  }, [pools]);

  const allTokensInfo = useTokensInfo(allAvailableStakeTokens);

  useEffect(() => {
    async function call() {
      if (allAvailableStakeTokens && principal && allTokensInfo) {
        const result = await Promise.all(
          allAvailableStakeTokens.map(async (tokenId) => {
            const result = await getTokenBalance(tokenId, principal);
            return result.data;
          }),
        );

        setAvailableTokens(result.filter((e) => !!e).length);

        const usdValue = result.reduce((prev, curr, index) => {
          const tokenId = allAvailableStakeTokens[index];
          const infoToken = infoAllTokens.find((e) => e.address === tokenId);
          const token = allTokensInfo.find((e) => e[1]?.canisterId === tokenId)?.[1];

          if (tokenId && infoToken && token && curr) {
            return prev.plus(parseTokenAmount(curr, token.decimals).multipliedBy(infoToken.priceUSD));
          }

          return prev;
        }, new BigNumber(0));

        setUSDValue(usdValue.toString());
      }
    }

    call();
  }, [allAvailableStakeTokens, setAvailableTokens, allTokensInfo, principal]);

  return useMemo(
    () => ({
      value: usdValue,
      tokens: availableTokens,
    }),
    [usdValue, availableTokens],
  );
}
