import { getAddress } from "@ethersproject/address";
import { isValidPrincipal } from "@icpswap/utils";

/**
 * Validates an address and returns the address
 * @param address the principal address
 */
export function validateAndParseAddress(address: string): string {
  if (isValidPrincipal(address)) return address;
  throw new Error(`${address} is not a valid address.`);
}

export function validateAndParseERC20Address(address: string): string {
  try {
    return getAddress(address);
  } catch (_error) {
    throw new Error(`${address} is not a valid address.`);
  }
}
