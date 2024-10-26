import { useMemo } from "react";
import { useToken } from "hooks/useToken";
import { useSnsTokenInfoByGovernance } from "hooks/sns/index";

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
      return snsTokenInfo?.canister_ids.ledger_canister_id;
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
