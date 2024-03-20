import { useEffect, useState } from "react";
import { TOKEN_STANDARD } from "@icpswap/constants";
import { network, NETWORK } from "constants/server";
import { useUpdateTokenStandards, useTokenStandards } from "store/token/cache/hooks";
import { useSwapPools } from "@icpswap/hooks";
import { registerTokens } from "@icpswap/token-adapter";
import { useSwapPools as useV2SwapPools } from "hooks/swap/v2/calls";
import { useUpdatePoolTokenStandardCallback } from "hooks/swap/v2/index";
import { updateTokens } from "store/allTokens";
import { useTokensFromList } from "@icpswap/hooks";

export const TOKENS = [
  { canisterId: "utozz-siaaa-aaaam-qaaxq-cai", standard: TOKEN_STANDARD.DIP20_WICP },
  { canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai", standard: TOKEN_STANDARD.DIP20_XTC },
  { canisterId: "rd6wb-lyaaa-aaaaj-acvla-cai", standard: TOKEN_STANDARD.DIP20 },
];

export function useInitialTokenStandard() {
  const [loading, setLoading] = useState(true);
  const { result: pools } = useSwapPools();
  const { result: tokenList, loading: fetchListLoading } = useTokensFromList();
  const [tokenListLoading, setTokenListLoading] = useState(true);
  const updateTokenStandard = useUpdateTokenStandards();
  const updatePoolTokenStandard = useUpdatePoolTokenStandardCallback();
  const tokenStandards = useTokenStandards();

  const { result: v2Pools } = useV2SwapPools();

  useEffect(() => {
    if (network === NETWORK.IC) {
      TOKENS.forEach((token) => {
        updateTokenStandard({ canisterId: token.canisterId, standard: token.standard as TOKEN_STANDARD });
      });
    }
  }, [network, NETWORK]);

  useEffect(() => {
    const call = async () => {
      if (pools && pools.length) {
        let allTokenIds: string[] = [];

        for (let i = 0; i < pools.length; i++) {
          const pool = pools[i];

          updateTokenStandard({ canisterId: pool.token0.address, standard: pool.token0.standard as TOKEN_STANDARD });
          updateTokenStandard({ canisterId: pool.token1.address, standard: pool.token1.standard as TOKEN_STANDARD });

          allTokenIds = allTokenIds.concat([pool.token0.address, pool.token1.address]);
        }

        updateTokens(allTokenIds);
      }
    };

    call();
  }, [pools]);

  useEffect(() => {
    const call = async () => {
      if (v2Pools && v2Pools.length) {
        for (let i = 0; i < v2Pools.length; i++) {
          const pool = v2Pools[i];
          await updatePoolTokenStandard(pool.pool, pool.token0);
          await updatePoolTokenStandard(pool.pool, pool.token1);
          updateTokens([pool.token0, pool.token1]);
        }
      }
    };

    call();
  }, [v2Pools]);

  useEffect(() => {
    if (tokenStandards) {
      Object.keys(tokenStandards).forEach((canisterId) => {
        registerTokens({ canisterIds: [canisterId], standard: tokenStandards[canisterId] });
      });
    }
  }, [tokenStandards]);

  useEffect(() => {
    if (tokenList) {
      tokenList.forEach((token) => {
        updateTokenStandard({
          canisterId: token.canisterId,
          standard: token.standard as TOKEN_STANDARD,
        });

        updateTokens([token.canisterId]);
      });

      setTokenListLoading(false);
    } else {
      if (!fetchListLoading) {
        setTokenListLoading(false);
      }
    }
  }, [tokenList, setTokenListLoading, fetchListLoading]);

  useEffect(() => {
    if (!tokenListLoading) {
      setLoading(false);
    }
  }, [tokenListLoading]);

  return {
    loading,
  };
}
