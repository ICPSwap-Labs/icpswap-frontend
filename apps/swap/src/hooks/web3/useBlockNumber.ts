import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import Web3 from "web3";

export function useFetchBlockNumber(): number | undefined {
  const { data } = useSwr(
    "ethBlockNumber",
    async () => {
      const web3 = new Web3(Web3.givenProvider);
      const blockNumber = await web3.eth.getBlockNumber();
      return Number(blockNumber);
    },
    {
      refreshInterval: 3000,
    },
  );

  return data;
}

export function useBlockNumber() {
  const { data } = useSWRImmutable<number>("ethBlockNumber");
  return data;
}

export function useFetchFinalizedBlock(): number | undefined {
  const { data } = useSwr(
    "ethFinalizedBlockNumber",
    async () => {
      const web3 = new Web3(Web3.givenProvider);
      const block = await web3.eth.getBlock("finalized");
      return Number(Number(block.number));
    },
    {
      refreshInterval: 3000,
    },
  );

  return data;
}

export function useFinalizedBlockNumber() {
  const { data } = useSWRImmutable<number>("ethFinalizedBlockNumber");
  return data;
}
