import { ALL_CANISTER_IDS } from "./canister";
import { LEDGER_CANISTER_ID } from "./icp";
import { ckBTC_MINTER_ID } from "./ckBTC";
import { getAllCanisters } from "store/allCanisters";

export const DelegationIds = [...ALL_CANISTER_IDS, LEDGER_CANISTER_ID, ckBTC_MINTER_ID];

export const MAX_DELEGATION_TARGETS = 999;

export async function getDelegationIds() {
  const canisterIds = [...ALL_CANISTER_IDS, LEDGER_CANISTER_ID, ckBTC_MINTER_ID];
  const stateCanisterIds = await getAllCanisters();
  const delegationIds = [...new Set(canisterIds.concat(stateCanisterIds ?? []))];
  return delegationIds.length > MAX_DELEGATION_TARGETS ? delegationIds.slice(0, MAX_DELEGATION_TARGETS) : delegationIds;
}
