import { useEffect, useMemo, useState, useCallback } from "react";
import { ICP } from "@icpswap/tokens";
import { parseTokenAmount, BigNumber, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { ChainKeyETHMinterInfo, IcpSwapAPITokenInfo } from "@icpswap/types";
import {
  useXDR2USD,
  useTokensFromList,
  getLimitedInfinityCallV1,
  getAllSwapTokens,
  getGlobalSettingTokens,
  getGlobalSettingChart,
} from "@icpswap/hooks";
import { setStorageTokenInfo } from "hooks/token/index";
import { useAllBridgeTokens } from "hooks/ck-bridge";
import { parseTokenStandards } from "utils/parseTokenStandards";
import { useUSDPriceById } from "hooks/useUSDPrice";
import {
  updateTokenList,
  updateAllSwapTokens,
  updateWalletConnector,
  updateBridgeTokens,
  updateGlobalMinterInfo,
  updateDefaultTokens,
  updateDefaultChartType,
} from "store/global/actions";

export function useGlobalTokenList() {
  return useAppSelector((state: AppState) => state.global.tokenList);
}

export interface SwapToken {
  canisterId: string;
  symbol: string;
  name: string;
  decimals: number;
}

export function useICPPrice() {
  const icpPrice = useUSDPriceById(ICP.address);

  return useMemo(() => {
    return icpPrice;
  }, [icpPrice]);
}

export function useICPAmountUSDValue(amount: number | null | string | undefined | bigint) {
  const ICPPrice = useICPPrice();

  return useMemo(() => {
    if (!ICPPrice || !amount) return undefined;
    return new BigNumber(ICPPrice).multipliedBy(parseTokenAmount(amount, ICP.decimals));
  }, [ICPPrice, amount]);
}

export function useICP2CyclesManager() {
  const icpPrice = useUSDPriceById(ICP.address);

  const { result: xdr_usd } = useXDR2USD();

  return useMemo(() => {
    if (nonUndefinedOrNull(icpPrice) && nonUndefinedOrNull(xdr_usd)) {
      return new BigNumber(icpPrice).dividedBy(xdr_usd).toFixed(4);
    }
    return 0;
  }, [xdr_usd, icpPrice]);
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
      const result = await getAllSwapTokens(offset, limit);
      return result?.content;
    };

    async function call() {
      if (allSwapTokens.length > 0 || loading) return;

      setLoading(true);
      const allTokens = await getLimitedInfinityCallV1<IcpSwapAPITokenInfo>(fetch, 1000, 2);

      const swapTokens = allTokens.map((token) => {
        const standard = parseTokenStandards(token);

        return {
          ...token,
          standard,
        };
      });

      dispatch(updateAllSwapTokens(swapTokens));

      swapTokens.forEach((token) => {
        setStorageTokenInfo({
          decimals: Number(token.decimals),
          name: token.name,
          symbol: token.symbol,
          canisterId: token.ledgerId,
          logo: token.logo,
          totalSupply: "0",
          transFee: token.fee.toString(),
          standardType: token.standard,
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

export function useFetchBridgeTokens() {
  const dispatch = useAppDispatch();
  const allBridgeTokens = useAllBridgeTokens();

  useEffect(() => {
    if (allBridgeTokens && allBridgeTokens.length > 0) {
      dispatch(updateBridgeTokens(allBridgeTokens));
    }
  }, [allBridgeTokens]);
}

export function useBridgeTokens() {
  return useAppSelector((state) => state.global.bridgeTokens);
}

export function useGlobalMinterInfoManager(): [
  ChainKeyETHMinterInfo | undefined,
  (minterInfo: ChainKeyETHMinterInfo) => void,
] {
  const globalMinterInfo = useAppSelector((state) => state.global.globalMinterInfo);
  const dispatch = useAppDispatch();

  const callback = useCallback(
    (minterInfo: ChainKeyETHMinterInfo) => {
      dispatch(updateGlobalMinterInfo({ minterInfo }));
    },
    [dispatch],
  );

  return useMemo(() => [globalMinterInfo, callback], [globalMinterInfo, callback]);
}

// Fetch the global settings
export function useGlobalDefaultTokens() {
  return useAppSelector((state) => state.global.defaultTokens);
}

export function useFetchGlobalDefaultTokens() {
  const defaultTokens = useGlobalDefaultTokens();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function call() {
      if (defaultTokens.length === 0) {
        const __defaultTokens = await getGlobalSettingTokens();
        dispatch(updateDefaultTokens(__defaultTokens.map((token) => token.toString())));
      }
    }

    call();
  }, [defaultTokens, dispatch]);

  return useMemo(() => defaultTokens, [defaultTokens]);
}

export function useGlobalDefaultChartType() {
  return useAppSelector((state) => state.global.defaultChartType);
}

export function useFetchGlobalDefaultChartType() {
  const defaultChartType = useGlobalDefaultChartType();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(defaultChartType)) {
        const __defaultChartType = await getGlobalSettingChart();
        dispatch(updateDefaultChartType(__defaultChartType));
      }
    }

    call();
  }, [defaultChartType, dispatch]);

  return useMemo(() => defaultChartType, [defaultChartType]);
}
