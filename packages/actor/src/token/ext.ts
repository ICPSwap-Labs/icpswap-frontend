import { type EXTToken, EXTTokenInterfaceFactory, type WrapICP, WrapICPInterfaceFactory } from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

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
