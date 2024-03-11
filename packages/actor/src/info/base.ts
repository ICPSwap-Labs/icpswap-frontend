import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";

import {
  BaseIndex,
  BaseStorage,
  BaseIndexInterfaceFactory,
  BaseStorageInterfaceFactory,
} from "@icpswap/candid";

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
