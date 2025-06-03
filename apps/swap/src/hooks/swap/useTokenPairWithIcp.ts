import { useEffect, useMemo, useState } from "react";
import { Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";

interface UesTokenPairWithIcpProps {
  tokenId: string | Null;
}

export function uesTokenPairWithIcp({ tokenId }: UesTokenPairWithIcpProps) {
  const [poolId, setPoolId] = useState<string | undefined>();

  useEffect(() => {
    async function call() {
      if (tokenId) {
        const result = await icpswap_fetch_post<{ poolId: string; token0Id: string; token1Id: string }>(
          "/info/pool/get",
          { ledgerId: tokenId },
        );

        const pairId = result?.data?.poolId;

        setPoolId(pairId);
      }
    }

    call();
  }, [tokenId]);

  return useMemo(() => {
    return poolId;
  }, [poolId]);
}
