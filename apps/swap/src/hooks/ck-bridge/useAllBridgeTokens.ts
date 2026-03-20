import { useChainKeyMinterInfo } from "@icpswap/hooks";
import { ckBTC, ckDoge, ckETH } from "@icpswap/tokens";
import type { ChainKeyETHMinterInfo } from "@icpswap/types";
import { MINTER_CANISTER_ID } from "constants/index";
import { useMemo } from "react";

export interface UseAllBridgeTokensProps {
  minter?: ChainKeyETHMinterInfo;
}

export function useAllBridgeTokens(__minterInfo?: ChainKeyETHMinterInfo) {
  const id = useMemo(() => {
    return __minterInfo ? undefined : MINTER_CANISTER_ID;
  }, [__minterInfo]);

  const { data: minterInfo } = useChainKeyMinterInfo(id);

  const supportedERC20Tokens = useMemo(() => {
    return (__minterInfo ?? minterInfo)?.supported_ckerc20_tokens[0]?.map((e) => e.ledger_canister_id.toString());
  }, [minterInfo, __minterInfo]);

  return [ckBTC.address, ckETH.address, ckDoge.address, ...(supportedERC20Tokens ?? [])];
}
