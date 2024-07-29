import { useMemo } from "react";
import type { Erc20MinterInfo } from "@icpswap/types";
import { useTokenFromActiveNetwork } from "hooks/web3/useTokenFromNetwork";

export function useERC20Token(tokenAddress: string | undefined) {
  return useTokenFromActiveNetwork(tokenAddress);
}

export function useERC20TokenByChainKeyId(
  tokenId: string | undefined,
  chainKeyMinterInfo: Erc20MinterInfo | undefined,
) {
  const tokenAddress = useMemo(() => {
    if (!tokenId || !chainKeyMinterInfo || !chainKeyMinterInfo.supported_ckerc20_tokens[0]) return undefined;

    const chainKeyInfo = chainKeyMinterInfo.supported_ckerc20_tokens[0].find(
      (token) => token.ledger_canister_id.toString() === tokenId,
    );

    return chainKeyInfo?.erc20_contract_address;
  }, [tokenId, chainKeyMinterInfo]);

  return useTokenFromActiveNetwork(tokenAddress);
}
