import { atom, useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";

const blockNumberAtom = atom<number | undefined>(undefined);

const DOGE_BLOCK_HEIGHT_API = "https://api.blockchair.com/dogecoin/stats";
const DOGE_BLOCK_NUMBER_REFETCH_INTERVAL_MS = 20_000;

export async function getDogeBlockNumber(): Promise<number | undefined> {
  try {
    const res = await fetch(DOGE_BLOCK_HEIGHT_API);
    const data = (await res.json()) as { data?: { blocks?: number } };
    return data?.data?.blocks;
  } catch {
    return undefined;
  }
}

export function useFetchDogeBlockNumber(): number | undefined {
  const [blockNumber, setBlockNumber] = useAtom(blockNumberAtom);

  useQuery({
    queryKey: ["dogeBlockNumber"],
    queryFn: async () => {
      const blockNumber = await getDogeBlockNumber();
      setBlockNumber(blockNumber);
    },
    refetchInterval: DOGE_BLOCK_NUMBER_REFETCH_INTERVAL_MS,
  });

  return blockNumber;
}

export function useDogeBlockNumber(): number | undefined {
  const [blockNumber] = useAtom(blockNumberAtom);
  return blockNumber;
}
