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

// let __mockedSyncBlock = 23194152 - 100;

// export function useMockEthereumTxSyncedBlock() {
//   const [mockedSyncBlock, setMockedSyncBlock] = useState<number>(0);

//   useEffect(() => {
//     async function call() {
//       setInterval(() => {
//         __mockedSyncBlock += 5;
//         setMockedSyncBlock(__mockedSyncBlock);
//       }, 3000);
//     }

//     call();
//   }, []);

//   return useCallback(
//     (erc20?: boolean) => {
//       return mockedSyncBlock;
//     },
//     [mockedSyncBlock],
//   );
// }

export function useEthereumTxSyncedBlock(erc20?: boolean) {
  const [minterInfo] = useGlobalMinterInfoManager();

  return useMemo(() => {
    if (isUndefinedOrNull(minterInfo)) return undefined;
    return erc20 ? minterInfo.last_erc20_scraped_block_number[0] : minterInfo.last_eth_scraped_block_number[0];
  }, [minterInfo]);
}

export function useEthereumTxSyncBlockCallback() {
  const [minterInfo] = useGlobalMinterInfoManager();

  return useCallback(
    (erc20?: boolean) => {
      if (isUndefinedOrNull(minterInfo)) return undefined;
      return erc20 ? minterInfo.last_erc20_scraped_block_number[0] : minterInfo.last_eth_scraped_block_number[0];
    },
    [minterInfo],
  );
}

export function useEthereumTxBlocksToSyncedBlock() {
  const getSyncedBlock = useEthereumTxSyncBlockCallback();

  return useCallback(
    (block: number, erc20?: boolean) => {
      const syncedBlock = getSyncedBlock(erc20);
      if (isUndefinedOrNull(syncedBlock)) return undefined;
      return block - Number(syncedBlock);
    },
    [getSyncedBlock],
  );
}

export function useEthereumTxSyncFinalized() {
  const getBlocksToSyncedBlock = useEthereumTxBlocksToSyncedBlock();

  return useCallback(
    (block: number, erc20?: boolean) => {
      const blocksToSyncedBlock = getBlocksToSyncedBlock(block, erc20);
      if (isUndefinedOrNull(blocksToSyncedBlock)) return undefined;
      return blocksToSyncedBlock < 0;
    },
    [getBlocksToSyncedBlock],
  );
}
