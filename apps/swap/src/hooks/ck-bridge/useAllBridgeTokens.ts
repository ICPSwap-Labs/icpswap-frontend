import { useMemo } from "react";
import { useChainKeyMinterInfo } from "@icpswap/hooks";
import { MINTER_CANISTER_ID } from "constants/index";
import { ckETH, ckBTC } from "@icpswap/tokens";
import { Erc20MinterInfo } from "@icpswap/types";

export interface UseAllBridgeTokensProps {
  minter?: Erc20MinterInfo;
}

export function useAllBridgeTokens(__minterInfo?: Erc20MinterInfo) {
  const id = useMemo(() => {
    return __minterInfo ? undefined : MINTER_CANISTER_ID;
  }, [__minterInfo]);

  const { result: minterInfo } = useChainKeyMinterInfo(id);

  const supportedERC20Tokens = useMemo(() => {
    return (__minterInfo ?? minterInfo)?.supported_ckerc20_tokens[0]?.map((e) => e.ledger_canister_id.toString());
  }, [minterInfo, __minterInfo]);

  return [ckBTC.address, ckETH.address, ...(supportedERC20Tokens ?? [])];
}
