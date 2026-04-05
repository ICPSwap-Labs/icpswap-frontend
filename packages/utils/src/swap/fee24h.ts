import { isUndefinedOrNull } from "../isUndefinedOrNull";

/** Estimates pool fees as 0.3% of `volumeUSD` (returns `undefined` when volume is nullish). */
export function calcPoolFees(volumeUSD: number | string | undefined): number | undefined {
  if (isUndefinedOrNull(volumeUSD)) return undefined;

  return (Number(volumeUSD) * 3) / 1000;
}
