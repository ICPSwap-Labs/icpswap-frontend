import { useMemo, useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { getTokenBalance } from "./useTokenBalance";
import { getPromisesAwait } from "../usePromisesAwait";

let GET_TOKENS_BALANCE_INDEX = 0;

export enum TokenBalanceState {
  LOADING = "LOADING",
  VALID = "VALID",
  INVALID = "INVALID",
}

export interface UserTokensBalanceArgs {
  tokenIds: string[];
  address: string | Principal | undefined;
}

export interface UserTokensBalanceResult {
  state: TokenBalanceState;
  balance: bigint | undefined;
}

export function useTokensBalance({ tokenIds, address }: UserTokensBalanceArgs): UserTokensBalanceResult[] {
  const [tokensBalance, setTokensBalance] = useState<{
    [id: string]: bigint | undefined;
  }>({});
  const [loadings, setLoadings] = useState<{ [id: string]: boolean }>({});

  const fetch_token_balance = async (tokenId: string, address: string | Principal, call_index: number) => {
    if (call_index !== GET_TOKENS_BALANCE_INDEX) {
      console.log("abort");
      return;
    }

    setLoadings((prevState) => ({
      ...prevState,
      [`${tokenId}_${address.toString()}`]: true,
    }));

    const result = await getTokenBalance({ canisterId: tokenId, address });

    setLoadings((prevState) => ({
      ...prevState,
      [`${tokenId}_${address.toString()}`]: false,
    }));

    setTokensBalance((prevState) => ({
      ...prevState,
      [`${tokenId}_${address.toString()}`]: result,
    }));
  };

  useEffect(() => {
    async function call() {
      if (tokenIds && address) {
        GET_TOKENS_BALANCE_INDEX++;
        const new_call_index = GET_TOKENS_BALANCE_INDEX;
        const calls = tokenIds.map(async (tokenId) => await fetch_token_balance(tokenId, address, new_call_index));
        await getPromisesAwait(calls, 10);
      }
    }

    call();
  }, [JSON.stringify(tokenIds), address]);

  return useMemo(() => {
    if (!tokenIds || !address) return [];
    return tokenIds.map((tokenId) => {
      if (!tokenId) return { state: TokenBalanceState.INVALID, balance: undefined };

      const balance = tokensBalance[`${tokenId}_${address.toString()}`];
      const loading = loadings[`${tokenId}_${address.toString()}`];

      if (loading) return { state: TokenBalanceState.LOADING, balance: undefined };
      if (balance === undefined) return { state: TokenBalanceState.INVALID, balance: undefined };

      return { state: TokenBalanceState.VALID, balance };
    });
  }, [tokensBalance, loadings, tokenIds, address]);
}
