/** Expected hex length for an ICP ledger account identifier string. */
export const ICP_ADDRESS_LENGTH = 64;

/** True if `address` is exactly 64 hexadecimal characters. */
export function isValidAccount(address: string): boolean {
  return /^[0-9a-fA-F]+$/.test(address) && ICP_ADDRESS_LENGTH === address.length;
}
