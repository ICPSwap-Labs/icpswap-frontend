import { type Ledger, LedgerInterfaceFactory } from "@icpswap/candid";
import { ic_host, LEDGER_CANISTER_ID } from "@icpswap/constants";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const ledgerService = (identity?: ActorIdentity) =>
  actor.create<Ledger>({
    idlFactory: LedgerInterfaceFactory,
    canisterId: LEDGER_CANISTER_ID,
    identity,
    host: ic_host,
  });
