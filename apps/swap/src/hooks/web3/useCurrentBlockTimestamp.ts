import { MULTICALL_ADDRESSES } from "@icpswap/constants";
import { useReadContract, useAccount } from "wagmi";
import { assume0xAddress } from "utils/wagmi";
import { useMemo } from "react";
import ms from "ms";

/**
 * Gets the current block timestamp from the blockchain
 * @param refetchInterval - The interval to refetch the block timestamp (defaults to 3 minutes)
 * @returns The current block timestamp
 */
export function useCurrentBlockTimestamp({ refetchInterval = ms("3min") }: { refetchInterval?: number | false } = {}):
  | number
  | undefined {
  const { chainId } = useAccount();

  const result = useReadContract({
    address: assume0xAddress(MULTICALL_ADDRESSES[chainId ?? 1]),
    abi: [
      {
        inputs: [],
        name: "getCurrentBlockTimestamp",
        outputs: [
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getCurrentBlockTimestamp",
    query: { refetchInterval },
  }).data;

  return useMemo(() => {
    return result ? Number(result.toString()) : undefined;
  }, [result]);
}
