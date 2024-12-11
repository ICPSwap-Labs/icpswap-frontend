import { isNullArgs, isValidPrincipal, principalToAccount } from "@icpswap/utils";
import { useLiquidityLockIds } from "@icpswap/hooks";
import { useMemo } from "react";
import { Null } from "@icpswap/types";

export function useSneedLedger(tokenIds: string[] | Null) {
  const { result: locksIds } = useLiquidityLockIds(tokenIds);

  return useMemo(() => {
    if (!locksIds) return undefined;
    return locksIds.find((e) => e.alias[0] === "Sneedlocked")?.ledger_id.toString();
  }, [locksIds]);
}

export interface UseIsSneedOwnerProps {
  owner: string | Null;
  sneedLedger: string | Null;
}

export function useIsSneedOwner({ owner, sneedLedger }: UseIsSneedOwnerProps) {
  return useMemo(() => {
    if (isNullArgs(owner) || isNullArgs(sneedLedger)) return false;

    if (isValidPrincipal(owner)) {
      return owner === sneedLedger;
    }

    return principalToAccount(sneedLedger) === owner;
  }, [sneedLedger, owner]);
}
