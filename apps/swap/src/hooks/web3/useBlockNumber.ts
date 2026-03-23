import { useQuery } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue } from "jotai";
import Web3 from "web3";

const INTERVAL = 10_000;
const blockNumberAtom = atom<number | undefined>(undefined);
const finalizedBlockNumberAtom = atom<number | undefined>(undefined);

export function useFetchBlockNumber() {
  const [, setBlockNumber] = useAtom(blockNumberAtom);

  useQuery({
    queryKey: ["ethBlockNumber"],
    queryFn: async () => {
      const web3 = new Web3(Web3.givenProvider);
      const blockNumber = await web3.eth.getBlockNumber();
      setBlockNumber(Number(blockNumber));
      return blockNumber;
    },
    refetchInterval: INTERVAL,
  });
}

export function useBlockNumber() {
  return useAtomValue(blockNumberAtom);
}

export function useFetchFinalizedBlock() {
  const [, setBlockNumber] = useAtom(finalizedBlockNumberAtom);

  useQuery({
    queryKey: ["ethFinalizedBlockNumber"],
    queryFn: async () => {
      const web3 = new Web3(Web3.givenProvider);
      const block = await web3.eth.getBlock("finalized");
      const blockNumber = Number(block.number);
      setBlockNumber(blockNumber);
      return blockNumber;
    },
    refetchInterval: INTERVAL,
  });
}

export function useFinalizedBlockNumber() {
  return useAtomValue(finalizedBlockNumberAtom);
}
