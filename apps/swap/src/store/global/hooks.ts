import { useEffect, useMemo, useCallback } from "react";
import { WRAPPED_ICP_TOKEN_INFO, TOKEN_STANDARD } from "constants/tokens";
import { ICP } from "@icpswap/tokens";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useImportedTokens, getTokenStandard } from "store/token/cache/hooks";
import { use100ICPPriceInfo, useXDR2USD, useTokensFromList } from "@icpswap/hooks";
import { updateXDR2USD, updateICPPriceList, updateTokenList, updatePoolStandardInitialed } from "./actions";

export function useAccount() {
  return useAppSelector((state: AppState) => state.auth.account);
}

export function useGlobalTokenList() {
  return useAppSelector((state: AppState) => state.global.tokenList);
}

export function useICPPriceList() {
  return useAppSelector((state: AppState) => state.global.ICPPriceList);
}

export interface SwapToken {
  canisterId: string;
  symbol: string;
  name: string;
  decimals: number;
}

export function useSwapTokenList(version?: "v2" | "v3"): SwapToken[] {
  const globalTokenList = useGlobalTokenList();
  const importedTokens = useImportedTokens();

  return useMemo(() => {
    const globalTokens = globalTokenList
      .map((token) => ({
        canisterId: token.canisterId.toString(),
        name: token.name,
        symbol: token.symbol,
        standard: token.standard as TOKEN_STANDARD,
        decimals: Number(token.decimals),
      }))
      .filter((token) => {
        if (version === "v2") {
          return token.canisterId.toString() !== ICP.address;
        }
        return token.canisterId.toString() !== WRAPPED_ICP_TOKEN_INFO.canisterId;
      });

    const iTokens = Object.keys(importedTokens ?? [])
      // filter if global tokens is already exist
      .filter((tokenId) => !globalTokens.find((t) => t.canisterId === tokenId))
      .map((tokenId) => ({
        canisterId: tokenId,
        symbol: importedTokens[tokenId].symbol,
        name: importedTokens[tokenId].name,
        // If the token support multiple standards, and user import token before the pool is created
        // So use the standard cached in storage firstly.
        standard: (getTokenStandard(tokenId) ?? importedTokens[tokenId].standardType) as TOKEN_STANDARD,
        decimals: importedTokens[tokenId].decimals,
      }));

    const ICPToken = {
      canisterId: ICP.address,
      symbol: ICP.symbol,
      name: ICP.name,
      standard: ICP.standard,
      decimals: ICP.decimals,
    } as SwapToken;

    return [...(version === "v2" ? [] : [ICPToken]), ...iTokens, ...globalTokens];
  }, [globalTokenList, importedTokens]);
}

export function useICPPrice() {
  const ICPPriceList = useICPPriceList();

  return useMemo(() => {
    if (ICPPriceList && ICPPriceList.length) {
      const price = ICPPriceList[ICPPriceList.length - 1].value;
      return price;
    }
    return undefined;
  }, [ICPPriceList]);
}

export function useICPAmountUSDValue(amount: number | null | string | undefined | bigint) {
  const ICPPrice = useICPPrice();

  return useMemo(() => {
    if (!ICPPrice || !amount) return undefined;
    return new BigNumber(ICPPrice).multipliedBy(parseTokenAmount(amount, ICP.decimals));
  }, [ICPPrice, amount]);
}

export function useICP2CyclesManager() {
  const ICPPriceList = useICPPriceList();

  return useMemo(() => {
    if (ICPPriceList && ICPPriceList.length) {
      return ICPPriceList[ICPPriceList.length - 1]?.xdr ?? 0;
    }
    return 0;
  }, [ICPPriceList]);
}

export function useStateXDR2USD() {
  return useAppSelector((state: AppState) => state.global.xdr_usdt);
}

export function useFetchXDR2USD() {
  const dispatch = useAppDispatch();

  const { result: xdr_usd } = useXDR2USD();

  useEffect(() => {
    async function call() {
      if (xdr_usd) {
        dispatch(updateXDR2USD(Number(xdr_usd)));
      }
    }

    call();
  }, [xdr_usd]);
}

export function useFetchICPPrices() {
  const dispatch = useAppDispatch();
  const xdr_usdt = useStateXDR2USD();

  const { result: icpPrices } = use100ICPPriceInfo();

  useEffect(() => {
    if (!icpPrices || !xdr_usdt || icpPrices.length === 0) return;

    const priceList = icpPrices.map((ele) => ({
      value: new BigNumber(new BigNumber(ele[1]).dividedBy(10000).times(xdr_usdt).toFixed(4)).toNumber(),
      timestamp: ele[0].toString(),
      xdr: new BigNumber(ele[1]).dividedBy(10000).toString(),
    }));

    dispatch(updateICPPriceList(priceList));
  }, [xdr_usdt, icpPrices]);
}

export function useFetchGlobalTokenList() {
  const dispatch = useAppDispatch();
  const { result: tokens, loading } = useTokensFromList();

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const allTokensFromList = [...tokens].sort((a, b) => {
        if (a && b) {
          if (a.rank < b.rank) return -1;
          if (a.rank === b.rank) return 0;
          if (a.rank > b.rank) return 1;
        }

        return 0;
      });

      dispatch(updateTokenList(allTokensFromList));
    }
  }, [tokens, dispatch]);

  return {
    loading,
    result: tokens,
  };
}

export function usePoolStandardManager(): [boolean, (value: boolean) => void] {
  const isInitialed = useAppSelector((state: AppState) => state.global.poolStandardUpdated);
  const dispatch = useAppDispatch();

  const call = useCallback(
    (value: boolean) => {
      dispatch(updatePoolStandardInitialed(value));
    },
    [dispatch],
  );

  return [isInitialed, call];
}

export function useTokenIsInTokenList(tokenId: string | undefined) {
  const globalTokenList = useGlobalTokenList();

  return useMemo(() => {
    if (!tokenId || !globalTokenList || globalTokenList.length === 0) return false;
    const token = globalTokenList.find((e) => e.canisterId === tokenId);
    return Boolean(token);
  }, [globalTokenList, tokenId]);
}
