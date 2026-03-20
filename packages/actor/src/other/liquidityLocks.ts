import { LiquidityLocksInterfaceFactory, type LiquidityLocksService } from "@icpswap/candid";
import { ActorName } from "../ActorName";

import { actor } from "../actor";

export const liquidityLocks = () =>
  actor.create<LiquidityLocksService>({
    actorName: ActorName.LiquidityLocks,
    idlFactory: LiquidityLocksInterfaceFactory,
  });
