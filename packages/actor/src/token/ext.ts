import { WrapICP, WrapICPInterfaceFactory, EXTToken, EXTTokenInterfaceFactory } from "@icpswap/candid";
import { ActorIdentity } from "@icpswap/types";

import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const ext = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<EXTToken>({
    identity,
    canisterId,
    idlFactory: EXTTokenInterfaceFactory,
  });

export const wrapICP = (identity?: ActorIdentity) =>
  actor.create<WrapICP>({
    actorName: ActorName.WICP,
    identity,
    idlFactory: WrapICPInterfaceFactory,
  });
