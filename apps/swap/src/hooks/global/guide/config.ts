import { atomWithStorage } from "jotai/utils";

export const LiquidityGuideName = "IcpSwap:liquidity-guide";

export const SwapGuideName = "IcpSwap:swap-guide";

export const GlobalGuideName = "IcpSwap:global-guide";

export const liquidityGuideAtom = atomWithStorage<boolean>(LiquidityGuideName, false);

export const swapGuideAtom = atomWithStorage<boolean>(SwapGuideName, false);

export const globalGuideAtom = atomWithStorage<boolean>(GlobalGuideName, false);

export function getGuideAtomValue(name: string) {
  switch (name) {
    case LiquidityGuideName:
      return liquidityGuideAtom;
    case SwapGuideName:
      return swapGuideAtom;
    case GlobalGuideName:
      return globalGuideAtom;
    default:
      return globalGuideAtom;
  }
}
