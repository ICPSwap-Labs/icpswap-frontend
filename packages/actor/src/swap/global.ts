import {
  type PositionIndex,
  PositionIndexInterfaceFactory,
  type SwapFactory,
  SwapFactoryInterfaceFactory,
  type SwapNFT,
  SwapNFTInterfaceFactory,
  type SwapPool,
  SwapPoolInterfaceFactory,
  type TICKET_SERVICE,
  TicketInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const swapNFT = (identity?: ActorIdentity) =>
  actor.create<SwapNFT>({
    actorName: ActorName.SwapNFTCanister,
    identity,
    idlFactory: SwapNFTInterfaceFactory,
  });

export const swapFactory = (identity?: ActorIdentity) =>
  actor.create<SwapFactory>({
    actorName: ActorName.SwapFactory,
    identity,
    idlFactory: SwapFactoryInterfaceFactory,
  });

export const swapPool = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<SwapPool>({
    identity,
    canisterId,
    idlFactory: SwapPoolInterfaceFactory,
  });

export const swapTicket = () =>
  actor.create<TICKET_SERVICE>({
    actorName: ActorName.SwapTicket,
    idlFactory: TicketInterfaceFactory,
  });

export const swapPosition = (identity?: ActorIdentity) =>
  actor.create<PositionIndex>({
    actorName: ActorName.Position,
    idlFactory: PositionIndexInterfaceFactory,
    identity,
  });
