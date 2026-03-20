import {
  type BaseIndex,
  BaseIndexInterfaceFactory,
  type BaseStorage,
  BaseStorageInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const baseIndex = (identity?: ActorIdentity) =>
  actor.create<BaseIndex>({
    idlFactory: BaseIndexInterfaceFactory,
    actorName: ActorName.BaseIndex,
    identity,
  });

export const baseStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<BaseStorage>({
    idlFactory: BaseStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
