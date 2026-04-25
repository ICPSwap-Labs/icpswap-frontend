import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";

const blockNumberAtom = atom<number | undefined>(undefined);

const DOGE_BLOCK_HEIGHT_API = "https://api.blockchair.com/dogecoin/stats";
const DOGE_BLOCK_NUMBER_REFETCH_INTERVAL_MS = 20_000;

export async function getDogeBlockNumber(): Promise<number | undefined> {
  try {
    const res = await fetch(DOGE_BLOCK_HEIGHT_API);
    const data = (await res.json()) as { data?: { best_block_height?: number } };
    return data?.data?.best_block_height;
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
      return blockNumber;
    },
    refetchInterval: DOGE_BLOCK_NUMBER_REFETCH_INTERVAL_MS,
  });

  return blockNumber;
}

export function useDogeBlockNumber(): number | undefined {
  const [blockNumber] = useAtom(blockNumberAtom);
  return blockNumber;
}
