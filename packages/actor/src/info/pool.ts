import { type PoolStorage, PoolStorageInterfaceFactory } from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const poolStorage = (id: string, identity?: ActorIdentity) =>
  actor.create<PoolStorage>({
    idlFactory: PoolStorageInterfaceFactory,
    canisterId: id,
    identity,
  });
