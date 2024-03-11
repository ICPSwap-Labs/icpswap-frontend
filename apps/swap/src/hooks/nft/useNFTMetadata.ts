import { useMemo } from "react";
import { useNFTMetadata as useNFTMetadataCall } from "hooks/nft/useNFTCalls";
import type { NFTTokenMetadata } from "@icpswap/types";

import { useNFTSvg } from "./useNFTSvg";

export function useNFTMetadata(canisterId: string, tokenId: number | bigint, reload?: boolean): NFTTokenMetadata {
  const { result } = useNFTMetadataCall(canisterId, tokenId, reload);

  const metadata = result ?? ({} as NFTTokenMetadata);

  const { isPositionNFT, positionSVG } = useNFTSvg(metadata);

  return useMemo(() => {
    if (isPositionNFT) {
      return {
        ...metadata,
        filePath: positionSVG ?? "",
      };
    }

    return metadata;
  }, [positionSVG, metadata, isPositionNFT]);
}

export function useNFTByMetadata(metadata: NFTTokenMetadata): NFTTokenMetadata {
  const { isPositionNFT, positionSVG } = useNFTSvg(metadata);

  return useMemo(() => {
    if (isPositionNFT) {
      return {
        ...metadata,
        filePath: positionSVG ?? "",
      };
    }
    return metadata;
  }, [isPositionNFT, positionSVG, metadata]);
}
