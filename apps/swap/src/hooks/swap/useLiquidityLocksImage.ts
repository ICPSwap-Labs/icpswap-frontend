import { useMemo } from "react";
import { useToken } from "hooks/useCurrency";
import { useSnsTokenInfoByGovernance } from "hooks/sns/useSnsTokenInfoByGovernance";

export function useLiquidityLocksImage(name: string | undefined, principalId: string | undefined) {
  const governanceId = useMemo(() => {
    if (!name || !principalId) return undefined;
    if (name.includes("Governance")) return principalId;
    return undefined;
  }, [name, principalId]);

  const snsTokenInfo = useSnsTokenInfoByGovernance(governanceId);

  const tokenId = useMemo(() => {
    if (!name || !principalId) return undefined;
    if (name.includes("Governance")) {
      return snsTokenInfo?.list_sns_canisters.ledger;
    }

    return undefined;
  }, [name, principalId, snsTokenInfo]);

  const [, token] = useToken(tokenId);

  return useMemo(() => {
    if (!tokenId) {
      switch (name) {
        case "Sneedlocked":
          return "/images/liquidity_locks_sneed.png";
        case "Black Hole":
          return "/images/liquidity_locks_blackhole.png";
        case "Free liquidity":
          return "/images/liquidity_locks_free.png";
        default:
          return undefined;
      }
    }

    return token?.logo;
  }, [token, tokenId, name, principalId]);
}
