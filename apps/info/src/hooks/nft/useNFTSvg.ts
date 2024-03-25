import { useEffect, useState, useMemo } from "react";
import type { NFTTokenMetadata } from "@icpswap/types";
import { SwapNFTCanisterId } from "constants/canister";
import { useSwapNFTSvg } from "hooks/swap/useSwapNFTSvg";
import { useV2SwapNFTSvg } from "hooks/swap/v2";
import v2Ids from "constants/v2/swap-v2-ids.json";

export type PositionSVG = {
  image: string;
};

export function useIsV2PositionNFT(data: NFTTokenMetadata): boolean {
  return data.cId === v2Ids.V3SwapNFTCanister.ic;
}

export function useIsV3PositionNFT(data: NFTTokenMetadata): boolean {
  return data.cId === SwapNFTCanisterId;
}

export function usePositionNFTSvg(metadata: NFTTokenMetadata): {
  isPositionNFT: boolean;
  positionSVG: PositionSVG;
} {
  const [positionSVG, setPositionSVG] = useState<PositionSVG>({ image: "" });

  const isV2PositionNFT = useIsV2PositionNFT(metadata);
  const isV3PositionNFT = useIsV3PositionNFT(metadata);

  const getSwapNFTTokenURI = useSwapNFTSvg();
  const getV2SwapNFTTokenURI = useV2SwapNFTSvg();

  useEffect(() => {
    (async () => {
      if (metadata.tokenId && (isV2PositionNFT || isV3PositionNFT)) {
        let poolId = String(metadata.tokenId);
        if (metadata.attributes && Boolean(metadata.attributes.length)) {
          const newPoolId = (metadata.attributes ?? []).find((item) => item.k === "poolId")?.v;
          if (newPoolId) {
            poolId = newPoolId;
          }
        }

        let svg = { image: "" } as PositionSVG;
        if (isV3PositionNFT) {
          svg = (await getSwapNFTTokenURI(parseInt(poolId))) as PositionSVG;
        } else if (isV2PositionNFT) {
          svg = (await getV2SwapNFTTokenURI(parseInt(poolId))) as PositionSVG;
        }

        setPositionSVG({ ...svg });
      }
    })();
  }, [metadata, isV2PositionNFT, isV3PositionNFT]);

  return useMemo(
    () => ({
      positionSVG,
      isPositionNFT: isV2PositionNFT || isV3PositionNFT,
    }),
    [isV2PositionNFT, isV3PositionNFT, positionSVG],
  );
}
