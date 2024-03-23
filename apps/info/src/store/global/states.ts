import { DEFAULT_LOCALE, SupportedLocale } from "constants/locales";
import { ICPPriceInfo, TokenMetadata } from "types/token";

export interface GlobalState {
  xdr_usdt: number;
  ICPPriceList: ICPPriceInfo[];
  tokenList: TokenMetadata[];
  userLocale: SupportedLocale;
  secondBlocks: string | number;
  blocks: string | number;
  snsTokenRootIds: { [key: string]: string };
}

export const initialState: GlobalState = {
  xdr_usdt: 1.31,
  ICPPriceList: [],
  tokenList: [],
  userLocale: DEFAULT_LOCALE,
  secondBlocks: "0",
  blocks: "0",
  snsTokenRootIds: {},
};
