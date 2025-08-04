import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { RetrieveBtcStatus } from "candid/ckBTCMint";
import { BITCOIN_CONFIRMATIONS } from "constants/ckBTC";
import { BitcoinTransaction, BitcoinTxResponse } from "types/ckBTC";
import {
  EthereumMintTransactionEvent,
  Erc20DissolveTransactionEvent,
  BridgeTransactionEvent,
  BitcoinTransactionEvent,
} from "types/web3";

export function isEthTransactionEvent(event: BridgeTransactionEvent): event is EthereumMintTransactionEvent {
  return event.chain === "eth";
}

export function isErc20DissolveTransactionEvent(event: BridgeTransactionEvent): event is Erc20DissolveTransactionEvent {
  return event.chain === "erc20" && event.type === "dissolve";
}

export function isErc20MintTransactionEvent(event: BridgeTransactionEvent): event is EthereumMintTransactionEvent {
  return event.chain === "erc20" && event.type === "mint";
}

export function isBtcTransactionEvent(event: BridgeTransactionEvent): event is BitcoinTransactionEvent {
  return event.chain === "btc";
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
  if (!transaction || !address) return "--";

  let amount: number | string = "--";

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
