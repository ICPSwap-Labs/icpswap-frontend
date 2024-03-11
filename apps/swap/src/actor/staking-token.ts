import { Identity } from "types/index";
import { actor } from "@icpswap/actor";
import { _SERVICE } from "candid/v1StakingToken";
import { idlFactory } from "candid/v1StakingToken.did";

export const v1StakingToken = (canisterId: string, identity?: Identity) =>
  actor.create<_SERVICE>({
    canisterId,
    identity,
    idlFactory: idlFactory,
  });
