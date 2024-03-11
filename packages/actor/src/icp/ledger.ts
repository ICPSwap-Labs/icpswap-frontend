import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import { Ledger, LedgerInterfaceFactory } from "@icpswap/candid";

import { LEDGER_CANISTER_ID, ic_host } from "@icpswap/constants";

export const ledgerService = (identity?: ActorIdentity) =>
  actor.create<Ledger>({
    idlFactory: LedgerInterfaceFactory,
    canisterId: LEDGER_CANISTER_ID,
    identity,
    host: ic_host,
  });
