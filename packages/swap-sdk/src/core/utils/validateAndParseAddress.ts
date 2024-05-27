import { isValidPrincipal } from "@icpswap/utils";
import { getAddress } from "@ethersproject/address";

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
  } catch (error) {
    throw new Error(`${address} is not a valid address.`);
  }
}
