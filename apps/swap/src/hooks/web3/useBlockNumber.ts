import { useWeb3React } from "@web3-react/core";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import { useSupportedActiveChain } from "hooks/web3/index";

export function useFetchBlockNumber() {
  const { provider } = useWeb3React();
  const supportedActiveChain = useSupportedActiveChain();

  const { data } = useSwr(
    provider && supportedActiveChain ? ["ethBlockNumber"] : undefined,
    async () => {
      if (provider && supportedActiveChain) {
        const blockNumber = await provider.getBlockNumber();
        return blockNumber;
      }
      return undefined;
    },
    {
      refreshInterval: 3000,
    },
  );

  return data;
}

export function useBlockNumber() {
  const { data } = useSWRImmutable<number>(["ethBlockNumber"]);
  return data;
}
