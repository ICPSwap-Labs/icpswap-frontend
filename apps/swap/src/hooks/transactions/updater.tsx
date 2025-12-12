import { TransactionReceipt } from "viem";
import { ChainId } from "@icpswap/constants";
import { useBlockNumber, useCurrentBlockTimestamp } from "hooks/web3/index";
import ms from "ms";
import { useCallback, useEffect } from "react";
import { useTransactionRemover } from "store/transactions/hooks";
import { TransactionDetails } from "store/transactions/types";
import { useAccount, usePublicClient } from "wagmi";

import { CanceledError, retry, RetryableError, RetryOptions } from "./retry";

interface Transaction {
  addedTime: number;
  receipt?: unknown;
  lastCheckedBlockNumber?: number;
}

export function shouldCheck(lastBlockNumber: number, tx: Transaction): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / ms(`1m`);

  if (minutesPending > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksSinceCheck > 9;
  }

  if (minutesPending > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksSinceCheck > 2;
  }

  return true;
}

const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {
  [ChainId.ARBITRUM_ONE]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.ARBITRUM_GOERLI]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.OPTIMISM]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.OPTIMISM_GOERLI]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.BASE]: { n: 10, minWait: 250, maxWait: 1000 },
};
const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 };

interface UpdaterProps {
  pendingTransactions: { [hash: string]: TransactionDetails };
  onCheck: (tx: { chainId: number; hash: string; blockNumber: number }) => void;
  onReceipt: (tx: { chainId: number; hash: string; receipt: TransactionReceipt }) => void;
}

export default function Updater({ pendingTransactions, onCheck, onReceipt }: UpdaterProps): null {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();

  const lastBlockNumber = useBlockNumber();
  // const fastForwardBlockNumber = useFastForwardBlockNumber();
  const removeTransaction = useTransactionRemover();
  const blockTimestamp = useCurrentBlockTimestamp();

  const getReceipt = useCallback(
    (hash: string) => {
      if (!publicClient || !chainId) throw new Error("No provider or chainId");
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS;
      return retry(
        () =>
          publicClient.getTransactionReceipt({ hash: hash as `0x${string}` }).then(async (receipt) => {
            if (receipt === null) {
              if (address) {
                const tx = pendingTransactions[hash];
                // Remove transactions past their deadline or - if there is no deadline - older than 6 hours.
                if (tx.deadline) {
                  // Deadlines are expressed as seconds since epoch, as they are used on-chain.
                  if (blockTimestamp && tx.deadline < blockTimestamp) {
                    removeTransaction(hash);
                  }
                } else if (tx.addedTime + ms(`6h`) < Date.now()) {
                  removeTransaction(hash);
                }
              }
              throw new RetryableError();
            }
            return receipt;
          }),
        retryOptions,
      );
    },
    [address, blockTimestamp, chainId, pendingTransactions, publicClient, removeTransaction],
  );

  useEffect(() => {
    if (!chainId || !publicClient || !lastBlockNumber) return;

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) => shouldCheck(lastBlockNumber, pendingTransactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash);
        promise
          .then((receipt) => {
            // fastForwardBlockNumber(receipt.blockNumber);
            onReceipt({ chainId, hash, receipt });
          })
          .catch((error) => {
            if (error instanceof CanceledError) return;
            onCheck({ chainId, hash, blockNumber: lastBlockNumber });
          });
        return cancel;
      });

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [chainId, publicClient, lastBlockNumber, getReceipt, onReceipt, onCheck, pendingTransactions]);

  return null;
}
