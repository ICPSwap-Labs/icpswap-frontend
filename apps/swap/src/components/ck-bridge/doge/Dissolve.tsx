import { BridgeChainName, BridgeChainType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useDissolve } from "hooks/ck-bridge/doge/useDissolve";
import { BitcoinStyleDissolveUI } from "components/ck-bridge/ui/BitcoinStyleDissolveUI";
import { isValidDogeAddress } from "utils/chain-key";
import { useDogeMinterInfo, useDogeWithdrawalFee } from "@icpswap/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { useUpdateDissolveTx } from "hooks/ck-bridge";

interface DissolveProps {
  token: Token;
  bridgeChain: BridgeChainType;
}

export function BridgeDissolve({ token, bridgeChain }: DissolveProps) {
  const { dissolve_call, loading } = useDissolve();
  const { data: dogeMinterInfo } = useDogeMinterInfo();
  const { data: dogeWithdrawalFee } = useDogeWithdrawalFee();
  const updateTx = useUpdateDissolveTx();

  const handleDissolve = useCallback(
    async ({ address, amount }: { address: string; amount: string }) => {
      if (!token) return;
      return await dissolve_call({ address, amount, token });
    },
    [dissolve_call, token, updateTx],
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
