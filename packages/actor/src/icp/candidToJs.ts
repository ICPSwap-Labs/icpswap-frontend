import { ActorIdentity } from "@icpswap/types";
import { CandidToJsInterfaceFactory, CandidToJsService } from "@icpswap/candid";
import { CANDID_TO_JS_ID, ic_host } from "@icpswap/constants";
import { actor } from "../actor";

export const candidToJsService = (identity?: ActorIdentity) =>
  actor.create<CandidToJsService>({
    idlFactory: CandidToJsInterfaceFactory,
    canisterId: CANDID_TO_JS_ID,
    identity,
    host: ic_host,
  });
