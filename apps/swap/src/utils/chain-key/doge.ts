import { parseTokenAmount } from "@icpswap/utils";
import type { NumberType } from "@icpswap/types";
import { sha256 } from "js-sha256";
import { BridgeTransactionEvent, DogeTransactionEvent } from "types/web3";
import { BridgeChainType } from "@icpswap/constants";
import { DogeDissolveTxState } from "types/chain-key";
import { RetrieveDogeStatus } from "@icpswap/candid";

export const dogeBlockExplorer = (height: number) => `https://www.oklink.com/dogecoin/block/${height}`;

export const dogeAddressExplorer = (address: string) => `https://www.oklink.com/dogecoin/address/${address}`;

export const dogeTransactionExplorer = (hash: string) => `https://www.oklink.com/dogecoin/tx/${hash}`;

export const parseDogeAmount = (amount: NumberType) => {
  return parseTokenAmount(amount, 8);
};

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Decode(input: string): Uint8Array | null {
  if (!input || !/^[1-9A-HJ-NP-Za-km-z]+$/.test(input)) return null;
  let num = 0n;
  for (let i = 0; i < input.length; i++) {
    const idx = BASE58_ALPHABET.indexOf(input[i]);
    if (idx === -1) return null;
    num = num * 58n + BigInt(idx);
  }
  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num % 256n));
    num /= 256n;
  }
  const leadingZeros = input.match(/^1+/)?.[0].length ?? 0;
  return new Uint8Array([...Array(leadingZeros).fill(0), ...bytes]);
}

/**
 * Validates a Dogecoin mainnet address (P2PKH starting with 'D' or P2SH starting with '9').
 * Uses Base58Check: decodes and verifies the 4-byte checksum (double SHA256).
 */
export function isValidDogeAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  if (trimmed.length < 33 || trimmed.length > 34) return false;
  if (trimmed[0] !== "D" && trimmed[0] !== "9") return false;

  const decoded = base58Decode(trimmed);
  if (!decoded || decoded.length !== 25) return false;

  const payload = decoded.slice(0, 21);
  const checksum = decoded.slice(21, 25);
  const hash1 = new Uint8Array(sha256.arrayBuffer(payload));
  const hash2 = new Uint8Array(sha256.arrayBuffer(hash1));
  for (let i = 0; i < 4; i++) {
    if (hash2[i] !== checksum[i]) return false;
  }
  return true;
}

export function isDogeTransactionEvent(event: BridgeTransactionEvent): event is DogeTransactionEvent {
  return event.chain === BridgeChainType.doge;
}

export function dogeDissolveState(status: RetrieveDogeStatus | undefined) {
  return (status ? Object.keys(status)[0] : "") as DogeDissolveTxState;
}

export function isDogeDissolveEnded(state: DogeDissolveTxState) {
  return !(state !== DogeDissolveTxState.Confirmed && state !== DogeDissolveTxState.AmountTooLow);
}

export function getDogeHashFromStatus(status: RetrieveDogeStatus | undefined): Uint8Array | number[] | undefined {
  return status ? Object.values(status)[0]?.txid : undefined;
}
