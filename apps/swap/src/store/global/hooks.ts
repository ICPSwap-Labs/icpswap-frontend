import { useEffect, useMemo, useState, useCallback } from "react";
import { ICP } from "@icpswap/tokens";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  use100ICPPriceInfo,
  useXDR2USD,
  useTokensFromList,
  getLimitedInfinityCall,
  getAllTokensOfSwap,
} from "@icpswap/hooks";
import { AllTokenOfSwapTokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { setStorageTokenInfo } from "hooks/token/index";

import {
  updateXDR2USD,
  updateICPPriceList,
  updateTokenList,
  updateAllSwapTokens,
  updateWalletConnector,
} from "./actions";

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

export function useTokenIsInTokenList(tokenId: string | undefined) {
  const globalTokenList = useGlobalTokenList();

  return useMemo(() => {
    if (!tokenId || !globalTokenList || globalTokenList.length === 0) return false;
    const token = globalTokenList.find((e) => e.canisterId === tokenId);
    return Boolean(token);
  }, [globalTokenList, tokenId]);
}

export function useStateSwapAllTokens() {
  return useAppSelector((state: AppState) => state.global.allSwapTokens);
}

export function useFetchAllSwapTokens() {
  const dispatch = useAppDispatch();
  const allSwapTokens = useStateSwapAllTokens();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async (offset: number, limit: number) => {
      const result = await getAllTokensOfSwap(offset, limit);
      return result?.content;
    };

    async function call() {
      if (allSwapTokens.length > 0 || loading) return;

      setLoading(true);
      const data = await getLimitedInfinityCall<AllTokenOfSwapTokenInfo>(fetch, 1000, 2);

      const swapTokens = data.map((e) => {
        return {
          ...e,
          standard:
            e.standard === "ICRC-1"
              ? TOKEN_STANDARD.ICRC1
              : e.standard === "ICRC-2"
              ? TOKEN_STANDARD.ICRC2
              : e.standard,
        };
      });

      dispatch(updateAllSwapTokens(swapTokens));

      swapTokens.forEach((token) => {
        setStorageTokenInfo({
          decimals: Number(token.decimals),
          name: token.name,
          symbol: token.symbol,
          canisterId: token.ledger_id.toString(),
          logo: token.logo[0] ?? "",
          totalSupply: "0",
          transFee: token.fee.toString(),
          standardType: token.standard as TOKEN_STANDARD,
        });
      });

      setLoading(false);
    }

    call();
  }, [allSwapTokens, dispatch]);

  return useMemo(() => ({ loading, result: allSwapTokens }), [loading, allSwapTokens]);
}

export function useWalletConnectorManager(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.global.walletConnector);

  const manage = useCallback(
    (open: boolean) => {
      dispatch(updateWalletConnector(open));
    },
    [dispatch],
  );

  return [open, manage];
}
