import { useCallback } from "react";
import { xtc } from "@icpswap/actor";
import { Identity as CallIdentity } from "types/global";
import { Principal } from "@dfinity/principal";
import { resultFormat } from "@icpswap/utils";

export interface XTCTopUpProps {
  canisterId: string;
  amount: bigint | number;
  identity: CallIdentity;
}

export function useXTCTopUp() {
  return useCallback(async ({ canisterId, amount, identity }: XTCTopUpProps) => {
    return resultFormat<bigint>(
      await (await xtc(identity)).burn({ canister_id: Principal.fromText(canisterId), amount: BigInt(amount) }),
    );
  }, []);
}
