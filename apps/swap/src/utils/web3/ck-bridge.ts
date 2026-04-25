import { BridgeChainType, BridgeType } from "@icpswap/constants";
import type { RetrieveBtcStatus } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { BITCOIN_CONFIRMATIONS } from "constants/chain-key";
import type { BitcoinTransaction, BitcoinTxResponse, BitcoinTxState } from "types/ckBTC";
import type {
  BitcoinTransactionEvent,
  BridgeTransactionEvent,
  DogeTransactionEvent,
  Erc20DissolveTransactionEvent,
  EthereumTransactionEvent,
} from "types/web3";

export function isEthTransactionEvent(event: BridgeTransactionEvent): event is EthereumTransactionEvent {
  return event.chain === BridgeChainType.eth;
}

export function isErc20DissolveTransactionEvent(event: BridgeTransactionEvent): event is Erc20DissolveTransactionEvent {
  return event.chain === BridgeChainType.erc20 && event.type === BridgeType.dissolve;
}

export function isErc20MintTransactionEvent(event: BridgeTransactionEvent): event is EthereumTransactionEvent {
  return event.chain === BridgeChainType.erc20 && event.type === BridgeType.mint;
}

export function isBtcTransactionEvent(event: BridgeTransactionEvent): event is BitcoinTransactionEvent {
  return event.chain === BridgeChainType.btc;
}

export function isDogeTransactionEvent(event: BridgeTransactionEvent): event is DogeTransactionEvent {
  return event.chain === BridgeChainType.doge;
}

export function isBTCDissolveConfirmed(status: RetrieveBtcStatus) {
  if ("Confirmed" in status) return true;

  return false;
}

export function isBtcMintTransaction(transaction: BitcoinTransaction, address: string) {
  if (!transaction || !address) return false;

  let contained = false;

  for (let i = 0; i < transaction.vin.length; i++) {
    const trans = transaction.vin[i];

    if (trans.prevout.scriptpubkey_address === address) {
      contained = true;
      break;
    }
  }

  return contained;
}

export function getBitcoinAmountFromTrans(
  transaction: BitcoinTransaction | undefined,
  address: string | undefined | null,
) {
  if (!transaction || !address) return undefined;

  let amount: number | string | undefined;

  for (let i = 0; i < transaction.vout.length; i++) {
    const trans = transaction.vout[i];

    if (trans.scriptpubkey_address === address) {
      amount = trans.value;
      break;
    }
  }

  return amount;
}

export function isBitcoinTransactionUnFinalized(tx: BitcoinTransaction, block: number) {
  return isUndefinedOrNull(tx.status.block_height)
    ? true
    : new BigNumber(block).minus(tx.status.block_height).isLessThan(BITCOIN_CONFIRMATIONS);
}

export function isBitcoinTxUnFinalized(tx: BitcoinTxResponse, block: number) {
  return isUndefinedOrNull(tx.block_height)
    ? true
    : new BigNumber(block).minus(tx.block_height).isLessThan(BITCOIN_CONFIRMATIONS);
}

export function isBitcoinTxUnFinalizedByBlock(txBlock: number | undefined, block: number) {
  return isUndefinedOrNull(txBlock) ? true : new BigNumber(block).minus(txBlock).isLessThan(BITCOIN_CONFIRMATIONS);
}

export function bitcoinDissolveState(status: RetrieveBtcStatus | undefined) {
  return (status ? Object.keys(status)[0] : "") as BitcoinTxState;
}

export function isBitcoinDissolveEnded(state: BitcoinTxState) {
  return !(state !== "Confirmed" && state !== "AmountTooLow");
}

export function bitcoinBytesToHexString(byteArray: number[]) {
  return Array.from(byteArray, (byte) => {
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }).join("");
}

export function getBitcoinTxFromStatus(status: RetrieveBtcStatus | undefined): Uint8Array | number[] | undefined {
  return status ? Object.values(status)[0]?.txid : undefined;
}
