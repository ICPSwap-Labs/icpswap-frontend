import type { NFTTokenMetadata, Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import v2Ids from "constants/swap-v2-ids.json";
import { usePositionNFTSvg } from "hooks/swap/useNFTSvg";
import { useMemo } from "react";

export function useIsPositionNFT(metadata: NFTTokenMetadata | Null): boolean {
  if (isUndefinedOrNull(metadata)) return false;
  return true;
}

export function useIsV2PositionNFT(metadata: NFTTokenMetadata | Null): boolean {
  if (isUndefinedOrNull(metadata)) return false;

  return metadata.cId === v2Ids.V3SwapNFTCanister.ic;
}

export function useNFTSvg(metadata: NFTTokenMetadata | Null) {
  const isV2PositionNFT = useIsV2PositionNFT(metadata);
  const isPositionNFT = useIsPositionNFT(metadata);

  const positionNFTSvg = usePositionNFTSvg(isPositionNFT || isV2PositionNFT ? metadata?.tokenId : undefined);

  return useMemo(
    () => ({
      positionSVG: positionNFTSvg,
      isPositionNFT: isPositionNFT || isV2PositionNFT,
    }),
    [isPositionNFT, isV2PositionNFT, positionNFTSvg],
  );
}
