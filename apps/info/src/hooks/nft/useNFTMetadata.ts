import { useMemo } from "react";
import { type NFTTokenMetadata } from "@icpswap/types";
import { useNFTMetadata as _userNFTMetadata } from "@icpswap/hooks";
import { usePositionNFTSvg } from "./useNFTSvg";

export function useNFTMetadata(canisterId: string, tokenId: number, reload?: boolean) {
  const { result: metadata } = _userNFTMetadata(canisterId, tokenId, reload);

  const { isPositionNFT, positionSVG } = usePositionNFTSvg(metadata);

  return useMemo(() => {
    if (isPositionNFT) {
      return {
        ...metadata,
        filePath: positionSVG.image,
      } as NFTTokenMetadata;
    }

    return metadata;
  }, [positionSVG, metadata, isPositionNFT]);
}

export function useNFTByMetadata(metadata: NFTTokenMetadata): NFTTokenMetadata {
  const { isPositionNFT, positionSVG } = usePositionNFTSvg(metadata);

  return useMemo(() => {
    if (isPositionNFT) {
      return {
        ...metadata,
        filePath: positionSVG.image,
      };
    }
    return metadata;
  }, [isPositionNFT, positionSVG, metadata]);
}
