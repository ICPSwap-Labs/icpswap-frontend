import { useBitcoinMintTxWatcher } from "hooks/ck-bridge/bitcoin";
import { useBitcoinDissolveTxWatcher } from "hooks/ck-bridge/bitcoin/useBitcoinDissolveTxWatcher";
import { useFetchBitcoinBlockNumber } from "hooks/ck-bridge/btc";
import { useDogeDissolveTxWatcher } from "hooks/ck-bridge/doge";
import { useFetchDogeBlockNumber } from "hooks/ck-bridge/doge/useBlockNumber";
import { useEthDissolveTxWatcher } from "hooks/ck-bridge/useEthDissolveTxWatcher";
import { useEthereumTxTips, useEthereumTxWatcher } from "hooks/ck-bridge/useEthereumTxWatcher";
import { useGlobalMinterInfo } from "hooks/ck-bridge/useGlobalMinterInfo";
import { useFetchBlockNumber, useFetchFinalizedBlock } from "hooks/web3/useBlockNumber";

export function useBridgeWatcher() {
  useGlobalMinterInfo();

  useEthDissolveTxWatcher();
  useEthereumTxWatcher();
  useEthereumTxTips();

  useBitcoinDissolveTxWatcher();
  useBitcoinMintTxWatcher();
  useFetchBitcoinBlockNumber();

  useFetchFinalizedBlock();
  useFetchBlockNumber();

  useFetchDogeBlockNumber();
  useDogeDissolveTxWatcher();
}
