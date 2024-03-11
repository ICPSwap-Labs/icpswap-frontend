import { actor, ActorName } from "@icpswap/actor";

import { _SERVICE as SwapFactory_update_call } from "candid/swap/SwapFactory_update_call";
import { idlFactory as SwapFactoryInterfaceFactory_update_call } from "candid/swap/SwapFactory_update_call.did";

export const swapFactory_update_call = () =>
  actor.create<SwapFactory_update_call>({
    actorName: ActorName.SwapFactory,
    idlFactory: SwapFactoryInterfaceFactory_update_call,
  });
