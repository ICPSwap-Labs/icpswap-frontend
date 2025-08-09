import { useEthDissolveTxWatcher } from "hooks/ck-bridge/useEthDissolveTxWatcher";
import { useBtcDissolveTxWatcher } from "hooks/ck-bridge/useBtcDissolveTxWatcher";
import { useEthereumTxWatcher, useEthereumTxTips } from "hooks/ck-bridge/useEthereumTxWatcher";
import { useGlobalMinterInfo } from "hooks/ck-bridge/useGlobalMinterInfo";
import { useErc20DissolveTxWatcher } from "hooks/ck-bridge/useErc20DissolveTxWatcher";
import { useBitcoinTxWatcher } from "hooks/ck-bridge/useBitcoinTxWatcher";
import { useFetchBitcoinBlockNumber } from "hooks/ck-bridge/btc";
import { useEthereumTxFinalizedTips } from "hooks/ck-bridge/useEthereumTxFinalizedTips";
import { useFetchFinalizedBlock, useFetchBlockNumber } from "hooks/web3/useBlockNumber";

export function useBridgeWatcher() {
  useGlobalMinterInfo();

  useEthDissolveTxWatcher();
  useEthereumTxWatcher();
  useEthereumTxTips();
  useErc20DissolveTxWatcher();
  useEthereumTxFinalizedTips();

  useBtcDissolveTxWatcher();
  useBitcoinTxWatcher();
  useFetchBitcoinBlockNumber();

  useFetchFinalizedBlock();
  useFetchBlockNumber();
}
