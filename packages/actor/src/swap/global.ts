import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";

import {
  SwapFactory,
  SwapFactoryInterfaceFactory,
  SwapNFT,
  SwapNFTInterfaceFactory,
  SwapPool,
  SwapPoolInterfaceFactory,
  TICKET_SERVICE,
  TicketInterfaceFactory,
  PositionIndex,
  PositionIndexInterfaceFactory,
} from "@icpswap/candid";

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
    canisterId: canisterId,
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
