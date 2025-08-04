import { useEthDissolveTxWatcher } from "hooks/ck-bridge/useEthDissolveTxWatcher";
import { useBtcDissolveTxWatcher } from "hooks/ck-bridge/useBtcDissolveTxWatcher";
import { useEthereumTxWatcher } from "hooks/ck-bridge/useEthereumTxWatcher";
import { useGlobalMinterInfo } from "hooks/ck-bridge/useGlobalMinterInfo";
import { useErc20DissolveTxWatcher } from "hooks/ck-bridge/useErc20DissolveTxWatcher";
import { useBitcoinTxWatcher } from "hooks/ck-bridge/useBitcoinTxWatcher";
import { useFetchBitcoinBlockNumber } from "hooks/ck-bridge/btc";

export function useBridgeWatcher() {
  useGlobalMinterInfo();

  useEthDissolveTxWatcher();
  useEthereumTxWatcher();
  useErc20DissolveTxWatcher();

  useBtcDissolveTxWatcher();
  useBitcoinTxWatcher();
  useFetchBitcoinBlockNumber();
}
