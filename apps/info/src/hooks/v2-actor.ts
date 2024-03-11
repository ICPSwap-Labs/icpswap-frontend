import { actor } from "@icpswap/actor";
import type { ActorIdentity } from "@icpswap/types";

import { _SERVICE as SwapGraphPool } from "constants/v2/Pools.did";
// @ts-ignore
import { idlFactory as SwapGraphPoolIdl } from "constants/v2/Pools.did.js";

import { _SERVICE as SwapGraphToken } from "constants/v2/Token.did";
// @ts-ignore
import { idlFactory as SwapGraphTokenIdl } from "constants/v2/Token.did.js";

import { _SERVICE as BaseDataStructure } from "constants/v2/BaseDataStructure.did";
// @ts-ignore
import { idlFactory as BaseDataStructureIdl } from "constants/v2/BaseDataStructure.did.js";

import { _SERVICE as SwapPool } from "constants/v2/SwapPool.did";
// @ts-ignore
import { idlFactory as SwapPoolIdl } from "constants/v2/SwapPool.did.js";

import { _SERVICE as SwapFactory } from "constants/v2/SwapFactory.did";
// @ts-ignore
import { idlFactory as SwapFactoryIdl } from "constants/v2/SwapFactory.did.js";

import v2Ids from "constants/v2/swap-v2-ids.json";

export const v2SwapPool = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<SwapPool>({
    identity,
    canisterId: canisterId,
    idlFactory: SwapPoolIdl,
  });

export const v2SwapFactory = (identity?: ActorIdentity) =>
  actor.create<SwapFactory>({
    identity,
    canisterId: v2Ids.SwapFactory.ic,
    idlFactory: SwapFactoryIdl,
  });

export const analyticSwap = (identity?: ActorIdentity) =>
  actor.create<BaseDataStructure>({
    identity,
    canisterId: v2Ids.BaseDataStructure.ic,
    idlFactory: BaseDataStructureIdl,
  });

export const analyticPool = () =>
  actor.create<SwapGraphPool>({
    idlFactory: SwapGraphPoolIdl,
    canisterId: v2Ids.Pools.ic,
  });

export const analyticToken = () =>
  actor.create<SwapGraphToken>({
    idlFactory: SwapGraphTokenIdl,
    canisterId: v2Ids.Token.ic,
  });
