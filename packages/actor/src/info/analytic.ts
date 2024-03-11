import { actor } from "../actor";
import { ActorName } from "../ActorName";

import {
  V2Base,
  V2BaseInterfaceFactory,
  V2Pools,
  V2PoolsInterfaceFactory,
  V2Token,
  V2TokenInterfaceFactory,
  V2TVL,
  V2TVLInterfaceFactory,
  V2ICPPrice,
  V2ICPPriceInterfaceFactory,
} from "@icpswap/candid";

export const analyticSwap = () =>
  actor.create<V2Base>({
    actorName: ActorName.SwapGraphRecord,
    idlFactory: V2BaseInterfaceFactory,
  });

export const analyticPool = () =>
  actor.create<V2Pools>({
    actorName: ActorName.SwapGraphPool,
    idlFactory: V2PoolsInterfaceFactory,
  });

export const analyticToken = () =>
  actor.create<V2Token>({
    actorName: ActorName.SwapGraphToken,
    idlFactory: V2TokenInterfaceFactory,
  });

export const analyticICP = () =>
  actor.create<V2ICPPrice>({
    actorName: ActorName.GraphICP,
    idlFactory: V2ICPPriceInterfaceFactory,
  });

export const analyticTVL = () =>
  actor.create<V2TVL>({
    actorName: ActorName.TVL,
    idlFactory: V2TVLInterfaceFactory,
  });
