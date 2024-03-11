import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { PoolStorage, PoolStorageInterfaceFactory } from "@icpswap/candid";

export const poolStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<PoolStorage>({
    idlFactory: PoolStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
