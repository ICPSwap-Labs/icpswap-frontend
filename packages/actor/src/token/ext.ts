import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import {
  WrapICP,
  WrapICPInterfaceFactory,
  EXTToken,
  EXTTokenInterfaceFactory,
} from "@icpswap/candid";

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
