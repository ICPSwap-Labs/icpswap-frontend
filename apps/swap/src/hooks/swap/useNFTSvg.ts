import { getSwapNFTTokenURI } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";

export type PositionSVG = {
  image: string;
};

export function usePositionNFTSvg(tokenId: string | number | bigint | undefined): string | undefined {
  const [positionSVG, setPositionSVG] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (tokenId) {
        let image = "";

        const result = (await getSwapNFTTokenURI(BigInt(tokenId))) as PositionSVG;
        image = result.image;

        setPositionSVG(image);
      }
    })();
  }, [tokenId]);

  return useMemo(() => positionSVG, [positionSVG]);
}
