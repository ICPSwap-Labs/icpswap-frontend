import {
  type Farm,
  type FarmController,
  FarmControllerInterfaceFactory,
  type FarmIndex,
  FarmIndexInterfaceFactory,
  FarmInterfaceFactory,
  type FarmStorage,
  FarmStorageInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const farmController = (identity?: ActorIdentity) =>
  actor.create<FarmController>({
    actorName: ActorName.FarmController,
    identity,
    idlFactory: FarmControllerInterfaceFactory,
  });

export const farm = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<Farm>({
    actorName: ActorName.Farm,
    canisterId,
    identity,
    idlFactory: FarmInterfaceFactory,
  });

export const farmStorage = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<FarmStorage>({
    actorName: ActorName.FarmStorage,
    canisterId,
    identity,
    idlFactory: FarmStorageInterfaceFactory,
  });

export const farmIndex = (identity?: ActorIdentity) =>
  actor.create<FarmIndex>({
    actorName: ActorName.FarmIndex,
    identity,
    idlFactory: FarmIndexInterfaceFactory,
  });
