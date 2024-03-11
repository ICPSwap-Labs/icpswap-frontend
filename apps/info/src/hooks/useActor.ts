import { actor } from "@icpswap/actor";
import v2Ids from "constants/v2/swap-v2-ids.json";
import { _SERVICE } from "constants/v2/SwapPositionManager.did";
//@ts-ignore
import { idlFactory } from "constants/v2/SwapPositionManager.did.js";

export const v2SwapPositionManager = () =>
  actor.create<_SERVICE>({ canisterId: v2Ids.SwapPositionManager.ic, idlFactory });
