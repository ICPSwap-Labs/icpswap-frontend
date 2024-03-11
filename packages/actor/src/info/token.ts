import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { TokenStorage, TokenStorageInterfaceFactory } from "@icpswap/candid";

export const tokenStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<TokenStorage>({
    idlFactory: TokenStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
