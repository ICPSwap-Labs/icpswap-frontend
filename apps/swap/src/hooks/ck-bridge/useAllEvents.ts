import { useMemo } from "react";
import { useEthEvents } from "hooks/ck-bridge/useEthEvents";
import { useErc20DissolveEvents, useErc20MintEvents } from "hooks/ck-bridge/useErc20Events";
import { useBtcDissolveEvents } from "hooks/ck-bridge/useBtcDissolveEvents";
import { useBtcMintEvents } from "hooks/ck-bridge/useBtcMintEvents";

export function useAllEvents() {
  const ethEvents = useEthEvents();
  const erc20DissolveEvents = useErc20DissolveEvents();
  const erc20MintEvents = useErc20MintEvents();
  const btcDissolveEvents = useBtcDissolveEvents();
  const btcMintEvents = useBtcMintEvents();

  return useMemo(() => {
    return [...ethEvents, ...erc20DissolveEvents, ...erc20MintEvents, ...btcDissolveEvents, ...btcMintEvents];
  }, [ethEvents, erc20MintEvents, btcDissolveEvents, btcMintEvents, erc20DissolveEvents]);
}
