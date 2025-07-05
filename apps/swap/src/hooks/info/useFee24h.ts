import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";

export function getFee24HFromVolume24H(volume24H: string | number) {
  return new BigNumber(volume24H).multipliedBy(3).dividedBy(1000).toString();
}

export function uesFee24HFromVolume24H(volume24H: string | number | undefined) {
  return useMemo(() => {
    if (isUndefinedOrNull(volume24H)) return undefined;
    return getFee24HFromVolume24H(volume24H);
  }, [volume24H]);
}
