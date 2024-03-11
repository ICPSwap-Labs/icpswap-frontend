import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { UserStorage, UserStorageInterfaceFactory } from "@icpswap/candid";

export const userStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<UserStorage>({
    idlFactory: UserStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
