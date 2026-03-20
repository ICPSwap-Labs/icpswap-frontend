import { type Governance, GovernanceInterfaceFactory } from "@icpswap/candid";
import { GOVERNANCE_CANISTER_ID, ic_host } from "@icpswap/constants";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const governanceService = (identity?: ActorIdentity) =>
  actor.create<Governance>({
    idlFactory: GovernanceInterfaceFactory,
    canisterId: GOVERNANCE_CANISTER_ID,
    identity,
    host: ic_host,
  });
