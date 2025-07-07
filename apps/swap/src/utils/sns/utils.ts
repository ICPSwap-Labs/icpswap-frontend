import { SnsSwapLifecycle } from "@icpswap/constants";
import { NnsTokenInfo } from "@icpswap/types";

export function tokenEqualToNnsLedger(nns: NnsTokenInfo, tokenId: string) {
  return nns.list_sns_canisters.ledger === tokenId;
}

export function nnsEqualToGovernance(nns: NnsTokenInfo, governanceId: string) {
  return nns.list_sns_canisters.governance === governanceId;
}

export function nnsEqualToRootId(nns: NnsTokenInfo, rootId: string) {
  return nns.list_sns_canisters.root === rootId;
}

export function getNnsRootId(nns: NnsTokenInfo | undefined) {
  return nns?.list_sns_canisters.root;
}

export function getNnsSwapId(nns: NnsTokenInfo | undefined) {
  return nns?.list_sns_canisters.swap;
}

export function getNnsLedgerId(nns: NnsTokenInfo | undefined) {
  return nns?.list_sns_canisters.ledger;
}

export function getNnsGovernanceId(nns: NnsTokenInfo | undefined) {
  return nns?.list_sns_canisters.governance;
}

export function isNnsCommitted(nns: NnsTokenInfo) {
  return Number(nns.lifecycle.lifecycle) === SnsSwapLifecycle.Committed;
}

export function isNnsOpen(nns: NnsTokenInfo) {
  return Number(nns.lifecycle.lifecycle) === SnsSwapLifecycle.Open;
}

export function isNnsPending(nns: NnsTokenInfo) {
  return Number(nns.lifecycle.lifecycle) === SnsSwapLifecycle.Pending;
}

export function isNnsAdopted(nns: NnsTokenInfo) {
  return Number(nns.lifecycle.lifecycle) === SnsSwapLifecycle.Adopted;
}

// Nns token logo
export function nnsTokenLogo(nns: NnsTokenInfo) {
  return `https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io${nns.meta.logo}`;
}
