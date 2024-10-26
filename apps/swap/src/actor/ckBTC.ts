import { actor, icrc2 } from "@icpswap/actor";
import { type ActorIdentity } from "@icpswap/types";
import { ckBTC_MINTER_ID, ckBTC_ID } from "constants/ckBTC";
import { _SERVICE } from "candid/ckBTCMint";
import { idlFactory } from "candid/ckBTCMint.did";

export const ckBtcMinter = (identity?: ActorIdentity) =>
  actor.create<_SERVICE>({
    canisterId: ckBTC_MINTER_ID,
    identity,
    idlFactory,
  });

export const ckBTCActor = async (identity?: ActorIdentity) => await icrc2(ckBTC_ID, identity);
