import { createContext, useContext } from "react";
import { Token } from "@icpswap/swap-sdk";

export type ConvertToIcp = {
  tokenId: string;
  icpAmount: string;
  poolId: string;
  amount: string;
  token: Token;
};

export interface BalanceConvertContextProps {
  tokensConvertToSwap: Array<ConvertToIcp> | undefined;
  setTokensConvertToIcp: (amount: Array<ConvertToIcp> | undefined) => void;
  convertedTokenIds: string[];
  setConvertedTokenIds: (tokenIds: string[]) => void;
  convertLoading: boolean;
  setConvertLoading: (loading: boolean) => void;
  checkedConvertTokenIds: string[];
  setCheckedConvertTokenIds: (tokenIds: string[]) => void;
}

export const BalanceConvertContext = createContext<BalanceConvertContextProps>({} as BalanceConvertContextProps);

export const useBalanceConvertContext = () => useContext(BalanceConvertContext);
