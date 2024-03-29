/* eslint-disable @typescript-eslint/prefer-as-const */

import invariant from "tiny-invariant";
import { validateAndParseAddress } from "../utils/validateAndParseAddress";
import { BaseCurrency } from "./baseCurrency";

interface ConstructorArgs {
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  logo?: string;
  transFee?: number;
  standard: string;
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends BaseCurrency {
  public readonly isNative: false = false;

  public readonly isToken: true = true;

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string;

  public constructor({ address, decimals, symbol, name, logo, transFee, standard }: ConstructorArgs) {
    super({
      decimals,
      symbol,
      name,
      logo,
      transFee,
      standard,
    });

    this.address = validateAndParseAddress(address);
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    return other.isToken && this.address === other.address;
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.address !== other.address, "ADDRESSES");
    return this.address.toLowerCase() < other.address.toLowerCase();
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this;
  }
}
