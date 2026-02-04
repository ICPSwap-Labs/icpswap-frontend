import { isUndefinedOrNull } from "../isUndefinedOrNull";

export function calcPoolFees(volumeUSD: number | string | undefined): number | undefined {
  if (isUndefinedOrNull(volumeUSD)) return undefined;

  return (Number(volumeUSD) * 3) / 1000;
}
