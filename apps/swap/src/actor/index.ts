import LedgerService from "candid/ledger";
import LedgerIdlFactory from "candid/ledger.did";
import { LEDGER_CANISTER_ID } from "constants/index";
import { actor } from "@icpswap/actor";
import { ActorIdentity } from "@icpswap/types";

export const ledgerService = (identity?: ActorIdentity) =>
  actor.create<LedgerService>({ idlFactory: LedgerIdlFactory, canisterId: LEDGER_CANISTER_ID, identity });

export * from "./swap";
