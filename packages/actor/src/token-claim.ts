import { actor } from "./actor";
import { ActorIdentity } from "@icpswap/types";
import { ActorName } from "./ActorName";
import {
  ClaimController,
  ClaimControllerInterfaceFactory,
  ClaimStorage,
  ClaimStorageInterfaceFactory,
} from "@icpswap/candid";

export const tokenClaimController = (identity?: ActorIdentity) =>
  actor.create<ClaimController>({
    actorName: ActorName.ClaimController,
    identity,
    idlFactory: ClaimControllerInterfaceFactory,
  });

export const tokenClaimStorage = (
  canisterId: string,
  identity?: ActorIdentity
) =>
  actor.create<ClaimStorage>({
    identity,
    canisterId,
    idlFactory: ClaimStorageInterfaceFactory,
  });
