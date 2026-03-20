import { type TokenStorage, TokenStorageInterfaceFactory } from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const tokenStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<TokenStorage>({
    idlFactory: TokenStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
