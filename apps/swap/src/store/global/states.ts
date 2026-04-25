import type { ChainKeyETHMinterInfo, IcpSwapAPITokenInfo } from "@icpswap/types";
import { DEFAULT_LOCALE, type SupportedLocale } from "constants/locales";
import type { TokenListMetadata } from "types/token-list";

export interface GlobalState {
  xdr_usdt: number;
  tokenList: TokenListMetadata[];
  hasBeenClaimTestToken: boolean;
  swapTokenList: [];
  userLocale: SupportedLocale;
  poolStandardUpdated: boolean;
  allSwapTokens: IcpSwapAPITokenInfo[];
  walletConnector: boolean;
  bridgeTokens: string[];
  globalMinterInfo: ChainKeyETHMinterInfo | undefined;
  defaultTokens: string[];
  defaultChartType: string | undefined;
}

export const initialState: GlobalState = {
  xdr_usdt: 1.33,
  tokenList: [],
  hasBeenClaimTestToken: false,
  swapTokenList: [],
  userLocale: DEFAULT_LOCALE,
  poolStandardUpdated: false,
  allSwapTokens: [],
  walletConnector: false,
  bridgeTokens: [],
  globalMinterInfo: undefined,
  defaultTokens: [],
  defaultChartType: undefined,
};
