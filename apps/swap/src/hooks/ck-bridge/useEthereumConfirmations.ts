import { TransactionResponse } from "@ethersproject/abstract-provider";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3";
import { useCallback, useMemo } from "react";

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
