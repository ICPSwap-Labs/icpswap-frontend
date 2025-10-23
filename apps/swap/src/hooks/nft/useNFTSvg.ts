import { useMemo } from "react";
import type { NFTTokenMetadata, Null } from "@icpswap/types";
import { V3SwapNFTCanisterId } from "constants/canister";
import v2Ids from "constants/swap-v2-ids.json";
import { usePositionNFTSvg } from "hooks/swap/useNFTSvg";
import { isUndefinedOrNull } from "@icpswap/utils";

export function useIsPositionNFT(metadata: NFTTokenMetadata | Null): boolean {
  if (isUndefinedOrNull(metadata)) return false;

  return metadata.cId === V3SwapNFTCanisterId;
}

export function useIsV2PositionNFT(metadata: NFTTokenMetadata | Null): boolean {
  if (isUndefinedOrNull(metadata)) return false;

  return metadata.cId === v2Ids.V3SwapNFTCanister.ic;
}

export function useNFTSvg(metadata: NFTTokenMetadata | Null) {
  const isV2PositionNFT = useIsV2PositionNFT(metadata);
  const isPositionNFT = useIsPositionNFT(metadata);

  const positionNFTSvg = usePositionNFTSvg(
    isPositionNFT || isV2PositionNFT ? metadata?.tokenId : undefined,
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
