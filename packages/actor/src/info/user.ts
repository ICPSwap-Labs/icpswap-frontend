import { type UserStorage, UserStorageInterfaceFactory } from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const userStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<UserStorage>({
    idlFactory: UserStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
