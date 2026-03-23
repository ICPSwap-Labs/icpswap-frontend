import { BridgeChainName, type BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import { validate } from "bitcoin-address-validation";
import { BitcoinStyleDissolveUI } from "components/ck-bridge/ui/BitcoinStyleDissolveUI";
import { BITCOIN_MIN_DISSOLVE_AMOUNT, BITCOIN_MINTER_DISSOLVE_FEE } from "constants/chain-key";
import { useDissolve } from "hooks/ck-btc/index";
import { useCallback } from "react";

interface BtcBridgeDissolveProps {
  token: Token;
  bridgeChain: BridgeChainType;
}

export function BtcBridgeDissolve({ token, bridgeChain }: BtcBridgeDissolveProps) {
  const { dissolve_call, loading } = useDissolve();

  const handleDissolve = useCallback(
    async ({ address, amount }: { amount: string; address: string }) => {
      if (!token) return;
      return await dissolve_call({ address, amount, token });
    },
    [dissolve_call, token],
  );

  return (
    <BitcoinStyleDissolveUI
      onDissolve={handleDissolve}
      dissolveLoading={loading}
      minAmount={BITCOIN_MIN_DISSOLVE_AMOUNT}
      validate={validate}
      chainName={BridgeChainName.bitcoin}
      bridgeChain={bridgeChain}
      token={token}
      withdrawalFee={BITCOIN_MINTER_DISSOLVE_FEE}
    />
  );
}
