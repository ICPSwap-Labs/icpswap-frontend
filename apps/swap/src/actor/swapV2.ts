import { actor } from "@icpswap/actor";
import { Identity } from "types/index";

import { _SERVICE as SWAP_POSITION_SERVICE } from "candid/swap-v2/SwapPositionManager";
import { idlFactory as SwapPositionInterface } from "candid/swap-v2/SwapPositionManager.did";
import { _SERVICE as V1SWAP_POSITION_SERVICE } from "candid/swap-v1/SwapPositionManager";
import { idlFactory as V1SwapPositionInterface } from "candid/swap-v1/SwapPositionManager.did";

import { _SERVICE as SWAP_FACTORY_SERVICE } from "candid/swap-v2/SwapFactory";
import { idlFactory as SwapFactoryInterface } from "candid/swap-v2/SwapFactory.did";

import { _SERVICE as SWAP_ROUTER_SERVICE } from "candid/swap-v2/SwapRouter";
import { idlFactory as SwapRouterInterface } from "candid/swap-v2/SwapRouter.did";

import { _SERVICE as SWAP_POOL_SERVICE } from "candid/swap-v2/SwapPool";
import { idlFactory as SwapPoolInterface } from "candid/swap-v2/SwapPool.did";

import { _SERVICE as BaseDataStructure } from "candid/swap-v2/InfoBase";
import { idlFactory as BaseDataStructureIdl } from "candid/swap-v2/InfoBase.did";

import { _SERVICE as INFO_POOLS_SERVICE } from "candid/swap-v2/InfoPools";
import { idlFactory as InfoPoolsInterface } from "candid/swap-v2/InfoPools.did";

import { _SERVICE as SWAP_NFT_SERVICE } from "candid/swap-v2/SwapNFT";
import { idlFactory as SwapNFTInterface } from "candid/swap-v2/SwapNFT.did";

import ids from "constants/swap-v2-ids.json";

export const swapPositionManager = (identity?: Identity) =>
  actor.create<SWAP_POSITION_SERVICE>({
    canisterId: ids.SwapPositionManager.ic,
    identity,
    idlFactory: SwapPositionInterface,
  });

export const swapFactory = (identity?: Identity) =>
  actor.create<SWAP_FACTORY_SERVICE>({
    canisterId: ids.SwapFactory.ic,
    identity,
    idlFactory: SwapFactoryInterface,
  });

export const swapRouter = (identity?: Identity) =>
  actor.create<SWAP_ROUTER_SERVICE>({
    canisterId: ids.SwapRouter.ic,
    identity,
    idlFactory: SwapRouterInterface,
  });

export const v2SwapNFT = (identity?: Identity) =>
  actor.create<SWAP_NFT_SERVICE>({
    identity,
    canisterId: ids.V3SwapNFTCanister.ic,
    idlFactory: SwapNFTInterface,
  });

export const swapRecord = (identity?: Identity) =>
  actor.create<BaseDataStructure>({
    canisterId: ids.BaseDataStructure.ic,
    identity,
    idlFactory: BaseDataStructureIdl,
  });

export const swapPool = (canisterId: string, identity?: Identity) =>
  actor.create<SWAP_POOL_SERVICE>({
    identity,
    canisterId,
    idlFactory: SwapPoolInterface,
  });

export const swapGraphPool = () =>
  actor.create<INFO_POOLS_SERVICE>({
    canisterId: ids.Pools.ic,
    idlFactory: InfoPoolsInterface,
  });

export const swapPositionManagerV1 = (identity?: Identity) =>
  actor.create<V1SWAP_POSITION_SERVICE>({
    canisterId: "eknb4-raaaa-aaaan-qanpa-cai",
    identity,
    idlFactory: V1SwapPositionInterface,
  });

export const swapFactoryV1 = (identity?: Identity) =>
  actor.create<SWAP_FACTORY_SERVICE>({
    identity,
    canisterId: "eepmu-kqaaa-aaaan-qanoa-cai",
    idlFactory: SwapFactoryInterface,
  });
