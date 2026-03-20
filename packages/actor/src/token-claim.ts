import {
  type ClaimController,
  ClaimControllerInterfaceFactory,
  type ClaimStorage,
  ClaimStorageInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "./ActorName";
import { actor } from "./actor";

export const tokenClaimController = (identity?: ActorIdentity) =>
  actor.create<ClaimController>({
    actorName: ActorName.ClaimController,
    identity,
    idlFactory: ClaimControllerInterfaceFactory,
  });

export const tokenClaimStorage = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<ClaimStorage>({
    identity,
    canisterId,
    idlFactory: ClaimStorageInterfaceFactory,
  });
