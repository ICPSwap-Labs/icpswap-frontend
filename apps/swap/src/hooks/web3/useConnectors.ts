import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { ConnectionType } from "utils/web3/connection";
import { getConnection } from "utils/web3/connection/utils";
import { useMemo } from "react";

export const BACKFILLABLE_WALLETS = [
  ConnectionType.COINBASE_WALLET,
  ConnectionType.WALLET_CONNECT,
  ConnectionType.INJECTED,
];

const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS];

export default function useConnectors() {
  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = [];

    orderedConnectionTypes.push(...SELECTABLE_WALLETS);

    // Add network connection last as it should be the fallback.
    orderedConnectionTypes.push(ConnectionType.NETWORK);

    // Convert to web3-react's representation of connectors.
    const web3Connectors: [Connector, Web3ReactHooks][] = orderedConnectionTypes
      .map(getConnection)
      .map(({ connector, hooks }) => [connector, hooks]);
    return web3Connectors;
  }, []);
}
