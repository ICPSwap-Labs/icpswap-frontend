import invariant from "tiny-invariant";
import { Currency } from "./currency";
import { Token } from "./token";

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export abstract class BaseCurrency {
  /**
   * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
   */
  public abstract readonly isNative: boolean;
  /**
   * Returns whether the currency is a token that is usable without wrapping
   */
  public abstract readonly isToken: boolean;

  /**
   * The decimals used in representing currency amounts
   */
  public readonly decimals: number;
  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol?: string;
  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name: string;

  public readonly logo: string;

  public readonly transFee: number;

  public readonly standard: string;

  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor({
    decimals,
    symbol,
    name,
    logo,
    transFee,
    standard
  }: {
    decimals: number;
    symbol?: string;
    name?: string;
    logo?: string;
    transFee?: number;
    standard: string;
  }) {
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");

    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name ?? "";
    this.logo = logo ?? "";
    this.transFee = transFee ?? 0;
    this.standard = standard;
  }

  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  public abstract equals(other: Currency): boolean;

  /**
   * Return the wrapped version of this currency that can be used with the ICPSwap contracts. Currencies must
   * implement this to be used in ICPSwap
   */
  public abstract get wrapped(): Token;
}
