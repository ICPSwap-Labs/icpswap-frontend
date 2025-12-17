import { Address } from "viem";

export function assume0xAddress(address: string): Address {
  // eslint-disable-next-line no-restricted-syntax
  return address as Address;
}
