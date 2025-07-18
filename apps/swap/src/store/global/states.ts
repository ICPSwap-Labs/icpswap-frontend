import { DEFAULT_LOCALE, SupportedLocale } from "constants/locales";
import { TokenListMetadata } from "types/token-list";
import { type IcpSwapAPITokenInfo } from "@icpswap/types";

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
  tokenBalances: { [key: string]: string };
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
  tokenBalances: {},
  defaultTokens: [],
  defaultChartType: undefined,
};
