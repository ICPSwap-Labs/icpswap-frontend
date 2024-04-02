import { Token } from "../core/entities/token";
import { Price } from "../core/entities/fractions/price";

interface useInverterProps {
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  quote: Token | undefined;
  base: Token | undefined;
  invert: boolean;
}

export function useInverter({ priceLower, priceUpper, quote, base, invert }: useInverterProps) {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  };
}
