import type { NFTControllerInfo } from "@icpswap/types";
import { getSwapNFTStat } from "hooks/nft/useNFTCalls";
import { useEffect, useMemo, useState } from "react";

const SwapNFTIds = ["4lnl6-hqaaa-aaaag-qblla-cai"];

export function useNFTMintSupply(canisterMetadata: NFTControllerInfo | undefined | null) {
  const [mintSupply, setMintSupply] = useState<undefined | bigint>(undefined);

  useEffect(() => {
    if (canisterMetadata && !SwapNFTIds.includes(canisterMetadata.cid)) {
      setMintSupply(canisterMetadata.mintSupply);
    } else if (canisterMetadata && SwapNFTIds.includes(canisterMetadata.cid)) {
      getSwapNFTStat().then((result) => {
        setMintSupply(result ? result[0] : undefined);
      });
    }
  }, [canisterMetadata]);

  return useMemo(() => mintSupply, [mintSupply]);
}
