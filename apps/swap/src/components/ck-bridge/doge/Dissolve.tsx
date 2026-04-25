import { BridgeChainName, type BridgeChainType } from "@icpswap/constants";
import { useDogeMinterInfo, useDogeWithdrawalFee } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { BitcoinStyleDissolveUI } from "components/ck-bridge/ui/BitcoinStyleDissolveUI";
import { useDissolve } from "hooks/ck-bridge/doge/useDissolve";
import { useCallback } from "react";
import { isValidDogeAddress } from "utils/chain-key";

interface DissolveProps {
  token: Token;
  bridgeChain: BridgeChainType;
}

export function BridgeDissolve({ token, bridgeChain }: DissolveProps) {
  const { dissolve_call, loading } = useDissolve();
  const { data: dogeMinterInfo } = useDogeMinterInfo();
  const { data: dogeWithdrawalFee } = useDogeWithdrawalFee();

  const handleDissolve = useCallback(
    async ({ address, amount }: { address: string; amount: string }) => {
      if (!token) return;
      return await dissolve_call({ address, amount, token });
    },
    [dissolve_call, token],
  );

  const validate = useCallback((address: string) => isValidDogeAddress(address), []);

  return (
    <BitcoinStyleDissolveUI
      token={token}
      bridgeChain={bridgeChain}
      onDissolve={handleDissolve}
      dissolveLoading={loading}
      validate={validate}
      minAmount={
        dogeMinterInfo?.retrieve_doge_min_amount
          ? parseTokenAmount(dogeMinterInfo.retrieve_doge_min_amount, token.decimals).toString()
          : undefined
      }
      chainName={BridgeChainName.doge}
      withdrawalFee={dogeWithdrawalFee?.minter_fee}
    />
  );
}
