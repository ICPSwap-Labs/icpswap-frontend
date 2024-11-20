import { Position } from "../entities/position";

export function getPriceOrderingFromPositionForUI(position: Position | undefined) {
  if (!position) return {};

  const token0 = position.amount0.currency;
  const token1 = position.amount1.currency;

  // if both prices are below 1, invert
  // if (position.token0PriceUpper.lessThan(1)) {
  //   return {
  //     priceLower: position.token0PriceUpper.invert(),
  //     priceUpper: position.token0PriceLower.invert(),
  //     quote: token0,
  //     base: token1,
  //   };
  // }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  };
}
