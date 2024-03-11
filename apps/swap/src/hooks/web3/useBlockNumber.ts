import { useWeb3React } from "@web3-react/core";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";

export function useFetchBlockNumber() {
  const { provider } = useWeb3React();

  const { data } = useSwr(
    provider ? ["ethBlockNumber"] : undefined,
    async () => {
      if (provider) {
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
