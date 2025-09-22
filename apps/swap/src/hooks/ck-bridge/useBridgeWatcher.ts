import { useEthDissolveTxWatcher } from "hooks/ck-bridge/useEthDissolveTxWatcher";
import { useBitcoinDissolveTxWatcher } from "hooks/ck-bridge/bitcoin/useBitcoinDissolveTxWatcher";
import { useEthereumTxWatcher, useEthereumTxTips } from "hooks/ck-bridge/useEthereumTxWatcher";
import { useGlobalMinterInfo } from "hooks/ck-bridge/useGlobalMinterInfo";
import { useErc20DissolveTxWatcher } from "hooks/ck-bridge/useErc20DissolveTxWatcher";
import { useBitcoinMintTxWatcher } from "hooks/ck-bridge/bitcoin";
import { useFetchBitcoinBlockNumber } from "hooks/ck-bridge/btc";
import { useFetchFinalizedBlock, useFetchBlockNumber } from "hooks/web3/useBlockNumber";

export function useBridgeWatcher() {
  useGlobalMinterInfo();

  useEthDissolveTxWatcher();
  useEthereumTxWatcher();
  useEthereumTxTips();
  useErc20DissolveTxWatcher();

  useBitcoinDissolveTxWatcher();
  useBitcoinMintTxWatcher();
  useFetchBitcoinBlockNumber();

  useFetchFinalizedBlock();
  useFetchBlockNumber();
}
