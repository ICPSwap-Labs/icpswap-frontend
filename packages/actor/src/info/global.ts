import {
  type GlobalIndex,
  GlobalIndexInterfaceFactory,
  type GlobalStorage,
  GlobalStorageInterfaceFactory,
  type GlobalTVL,
  GlobalTVLInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const globalIndex = (identity?: ActorIdentity) =>
  actor.create<GlobalIndex>({
    idlFactory: GlobalIndexInterfaceFactory,
    actorName: ActorName.GlobalIndex,
    identity,
  });

export const globalStorage = (id: string) =>
  actor.create<GlobalStorage>({
    idlFactory: GlobalStorageInterfaceFactory,
    canisterId: id,
  });

export const globalTVL = (id: string, identity?: ActorIdentity) =>
  actor.create<GlobalTVL>({
    idlFactory: GlobalTVLInterfaceFactory,
    canisterId: id,
    identity,
  });
