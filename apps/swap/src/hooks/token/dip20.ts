import { useCallback } from "react";
import { xtc } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";
import { resultFormat } from "@icpswap/utils";

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
