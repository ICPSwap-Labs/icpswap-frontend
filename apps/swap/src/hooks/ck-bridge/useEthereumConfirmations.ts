import { TransactionResponse } from "@ethersproject/abstract-provider";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3";
import { useCallback, useMemo } from "react";
import { useGlobalMinterInfoManager } from "store/global/hooks";

export function useEthereumConfirmations(transactionResponse: TransactionResponse | undefined) {
  const blockNumber = useBlockNumber();

  return useMemo(() => {
    if (
      isUndefinedOrNull(blockNumber) ||
      isUndefinedOrNull(transactionResponse) ||
      isUndefinedOrNull(transactionResponse.blockNumber)
    )
      return undefined;

    return Number(blockNumber) - transactionResponse.blockNumber;
  }, [blockNumber, transactionResponse]);
}

export function useEthereumConfirmationsByBlock(block: number | undefined) {
  const blockNumber = useBlockNumber();

  return useMemo(() => {
    if (isUndefinedOrNull(blockNumber) || isUndefinedOrNull(block)) return undefined;

    return Number(blockNumber) - block;
  }, [blockNumber, block]);
}

export function useEthereumConfirmationsByBlockCallback() {
  const blockNumber = useBlockNumber();

  return useCallback(
    (block: number | undefined) => {
      if (isUndefinedOrNull(blockNumber) || isUndefinedOrNull(block)) return undefined;
      return Number(blockNumber) - block;
    },
    [blockNumber],
  );
}

export function useEthereumConfirmationsCallback() {
  const blockNumber = useBlockNumber();

  return useCallback(
    (transactionResponse: TransactionResponse) => {
      if (isUndefinedOrNull(blockNumber) || isUndefinedOrNull(transactionResponse.blockNumber)) return undefined;

      return Number(blockNumber) - transactionResponse.blockNumber;
    },
    [blockNumber],
  );
}

export function useEthereumTxBlockSynced() {
  const [minterInfo] = useGlobalMinterInfoManager();

  return useCallback(
    (block: number, erc20?: boolean) => {
      if (isUndefinedOrNull(minterInfo)) return undefined;

      const syncedBlock = erc20
        ? minterInfo.last_erc20_scraped_block_number[0]
        : minterInfo.last_eth_scraped_block_number[0];

      if (isUndefinedOrNull(syncedBlock)) return false;

      return Number(syncedBlock) - block >= 0;
    },
    [minterInfo],
  );
}
