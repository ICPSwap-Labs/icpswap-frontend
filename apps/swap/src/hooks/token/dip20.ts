import { Principal } from "@icp-sdk/core/principal";
import { xtc } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { useCallback } from "react";

export interface XTCTopUpProps {
  canisterId: string;
  amount: bigint | number;
}

export function useXTCTopUp() {
  return useCallback(async ({ canisterId, amount }: XTCTopUpProps) => {
    return resultFormat<bigint>(
      await (await xtc(true)).burn({ canister_id: Principal.fromText(canisterId), amount: BigInt(amount) }),
    );
  }, []);
}
