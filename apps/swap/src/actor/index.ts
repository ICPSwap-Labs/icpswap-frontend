import { Identity } from "types/index";
import LedgerService from "candid/ledger";
import LedgerIdlFactory from "candid/ledger.did";
import { LEDGER_CANISTER_ID } from "constants/index";
import { actor } from "@icpswap/actor";

export const ledgerService = (identity?: Identity) =>
  actor.create<LedgerService>({ idlFactory: LedgerIdlFactory, canisterId: LEDGER_CANISTER_ID, identity });

export * from "./token";
export * from "./swap";
export * from "./ckBTC";
