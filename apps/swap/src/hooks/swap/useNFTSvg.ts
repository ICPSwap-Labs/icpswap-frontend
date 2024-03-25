import { useEffect, useState, useMemo } from "react";
import { getSwapNFTTokenURI } from "@icpswap/hooks";
import { getV2SwapNFTTokenURI } from "hooks/swap/v2/useSwapCalls";

export type PositionSVG = {
  image: string;
};

export function usePositionNFTSvg(
  tokenId: string | number | bigint | undefined,
  version?: "v2" | "v3",
): string | undefined {
  const [positionSVG, setPositionSVG] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (tokenId) {
        let image = "";

        if (version === "v2") {
          image = await getV2SwapNFTTokenURI(BigInt(tokenId));
        } else {
          const result = (await getSwapNFTTokenURI(BigInt(tokenId))) as PositionSVG;
          image = result.image;
        }

        setPositionSVG(image);
      }
    })();
  }, [tokenId, version]);

  return useMemo(() => positionSVG, [positionSVG]);
}
