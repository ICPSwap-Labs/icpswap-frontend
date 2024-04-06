import { drawerWidth } from "constants/theme";
import { DEFAULT_LOCALE, SupportedLocale } from "constants/locales";
import { ICPPriceInfo } from "types/token";
import { TokenListMetadata } from "types/token-list";

export interface GlobalState {
  drawerWidth: number;
  xdr_usdt: number;
  ICPPriceList: ICPPriceInfo[];
  tokenList: TokenListMetadata[];
  hasBeenClaimTestToken: boolean;
  swapTokenList: [];
  userLocale: SupportedLocale;
  poolStandardUpdated: boolean;
  snsTokenRootIds: { [key: string]: string };
}

export const initialState: GlobalState = {
  drawerWidth,
  xdr_usdt: 1.33,
  ICPPriceList: [],
  tokenList: [],
  hasBeenClaimTestToken: false,
  swapTokenList: [],
  userLocale: DEFAULT_LOCALE,
  poolStandardUpdated: false,
  snsTokenRootIds: {},
};
