import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";

import {
  V3TradeCanister,
  V3TradeCanisterInterfaceFactory,
  NFTCanister as NFT_SERVICE,
  NFTCanisterInterfaceFactory,
  V3TradeStat,
  V3TradeStatInterfaceFactory,
  V3NFTCanisterController,
  V3NFTCanisterControllerInterfaceFactory,
  NFTFile,
  NFTFileInterfaceFactory,
  V1NFTCanister,
  V1NFTCanisterInterfaceFactory,
  ExtNFTInterfaceFactory,
  ExtNFTService,
} from "@icpswap/candid";

export const NFTCanisterController = (identity?: ActorIdentity) =>
  actor.create<V3NFTCanisterController>({
    actorName: ActorName.NFTCanisterController,
    identity,
    idlFactory: V3NFTCanisterControllerInterfaceFactory,
  });

export const NFTCanister = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<NFT_SERVICE>({
    canisterId,
    identity,
    actorName: ActorName.NFTCanister,
    idlFactory: NFTCanisterInterfaceFactory,
  });

export const NFTTradeCanister = (identity?: ActorIdentity) => {
  return actor.create<V3TradeCanister>({
    identity,
    actorName: ActorName.NFTTradeCanister,
    idlFactory: V3TradeCanisterInterfaceFactory,
  });
};

export const NFTTradeStat = (identity?: ActorIdentity) => {
  return actor.create<V3TradeStat>({
    identity,
    actorName: ActorName.NFTTradeStat,
    idlFactory: V3TradeStatInterfaceFactory,
  });
};

export const NFT_V1 = (canisterId: string, identity?: ActorIdentity) => {
  return actor.create<V1NFTCanister>({
    identity,
    idlFactory: V1NFTCanisterInterfaceFactory,
    canisterId,
  });
};

export const nftFile = (canisterId: string, identity?: ActorIdentity) => {
  return actor.create<NFTFile>({
    identity,
    idlFactory: NFTFileInterfaceFactory,
    canisterId,
  });
};

export const ext_nft = (canisterId: string, identity?: ActorIdentity) => {
  return actor.create<ExtNFTService>({
    identity,
    idlFactory: ExtNFTInterfaceFactory,
    canisterId,
  });
};
