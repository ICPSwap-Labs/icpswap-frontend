import { Web3Provider } from "@ethersproject/providers";
import type { Client, Transport, Chain } from "viem";
import { useMemo } from "react";
import { useClient } from "wagmi";
import { mainnet } from "wagmi/chains";

const providers = new WeakMap<Client, Web3Provider>();

export function clientToWeb3js(client?: Client<Transport, Chain>) {
  if (!client) return undefined;

  const { transport } = client;

  const provider = new Web3Provider(transport, mainnet.id);
  providers.set(client, provider);
  return provider;
}

/** Hook to convert a connected viem Client to an ethers.js Provider. */
export function useEthersWeb3Provider({ chainId = 1 }: { chainId?: number } = {}) {
  const client = useClient({ chainId });

  return useMemo(() => clientToWeb3js(client), [chainId, client]);
}
