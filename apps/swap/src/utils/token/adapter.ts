import type { Principal } from "@icp-sdk/core/principal";
import { actor } from "@icpswap/actor";
import type { ActorIdentity } from "@icpswap/types";
import { isPrincipal, resultFormat } from "@icpswap/utils";
import type { _SERVICE as OGY_SERVICE } from "candid/ogy";
import { idlFactory as OGY_IDL } from "candid/ogy.did";

const ORG_ID = "rd6wb-lyaaa-aaaaj-acvla-cai";

const ogy = async (identity?: ActorIdentity) =>
  actor.create<OGY_SERVICE>({ canisterId: ORG_ID, idlFactory: OGY_IDL, identity });

const BALANCE_ADAPTER_IDS = [ORG_ID];

export const isNeedBalanceAdapter = (canisterId: string) => BALANCE_ADAPTER_IDS.includes(canisterId);

export async function balanceAdapter(canisterId: string, account: string | Principal) {
  switch (canisterId) {
    case ORG_ID:
      if (isPrincipal(account)) {
        return resultFormat<bigint>(await (await ogy()).balanceOf(account));
      }
      throw Error("not support address");

    default:
      throw Error("no canister id");
  }
}
