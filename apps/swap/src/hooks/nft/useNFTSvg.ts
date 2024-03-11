import { useMemo } from "react";
import type { NFTTokenMetadata } from "@icpswap/types";
import { V3SwapNFTCanisterId } from "constants/canister";
import v2Ids from "constants/swap-v2-ids.json";
import { usePositionNFTSvg } from "hooks/swap/useNFTSvg";

export function useIsPositionNFT(data: NFTTokenMetadata): boolean {
  return data.cId === V3SwapNFTCanisterId;
}

export function useIsV2PositionNFT(data: NFTTokenMetadata): boolean {
  return data.cId === v2Ids.V3SwapNFTCanister.ic;
}

export function useNFTSvg(metadata: NFTTokenMetadata) {
  const isV2PositionNFT = useIsV2PositionNFT(metadata);
  const isPositionNFT = useIsPositionNFT(metadata);

  const positionNFTSvg = usePositionNFTSvg(
    isPositionNFT || isV2PositionNFT ? metadata.tokenId : undefined,
    isV2PositionNFT ? "v2" : "v3",
  );

  return useMemo(
    () => ({
      positionSVG: positionNFTSvg,
      isPositionNFT: isPositionNFT || isV2PositionNFT,
    }),
    [isPositionNFT, isV2PositionNFT, positionNFTSvg],
  );
}
