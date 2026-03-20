import type { NFTTokenMetadata, Null } from "@icpswap/types";
import { useNFTMetadata as useNFTMetadataCall } from "hooks/nft/useNFTCalls";
import { useMemo } from "react";

import { useNFTSvg } from "./useNFTSvg";

export function useNFTMetadata(canisterId: string | Null, tokenId: number | bigint | Null, reload?: boolean) {
  const { data: metadata, isLoading: loading } = useNFTMetadataCall(canisterId, tokenId, reload);

  const { isPositionNFT, positionSVG } = useNFTSvg(metadata);

  const __metadata = useMemo(() => {
    // if (isPositionNFT) {
    //   return {
    //     ...metadata,
    //     filePath: positionSVG ?? "",
    //   };
    // }

    return metadata;
  }, [positionSVG, metadata, isPositionNFT]);

  return useMemo(() => ({ metadata: __metadata, loading }), [__metadata, loading]);
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
