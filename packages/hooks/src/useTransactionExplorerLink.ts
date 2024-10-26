import { useMemo } from "react";
import { ICP } from "@icpswap/tokens";
import { principalToAccount } from "@icpswap/utils";

export type TransactionLink = "dashboard" | "ic-explorer" | "NFTGeek" | "ic-house";

export interface GetTransactionExplorerLink {
  isBridgeToken?: boolean;
  snsRootId?: string;
  tokenId: string;
  principal: string;
  type: TransactionLink;
}

export function getTransactionExplorerLink({
  principal,
  tokenId,
  snsRootId,
  isBridgeToken,
  type,
}: UseTransactionExplorerLink) {
  const account = principalToAccount(principal);

  let url = "";

  if (type === "dashboard") {
    if (tokenId === ICP.address) {
      url = `https://dashboard.internetcomputer.org/account/${account}`;
    } else if (snsRootId) {
      url = `https://dashboard.internetcomputer.org/sns/${snsRootId}/account/${principal}`;
    } else if (isBridgeToken) {
      url = `https://dashboard.internetcomputer.org/ethereum/${tokenId}/account/${principal}`;
    } else {
      url = `https://dashboard.internetcomputer.org/account/${account}`;
    }
  } else if (type === "ic-house") {
    url = `https://637g5-siaaa-aaaaj-aasja-cai.raw.ic0.app/address/${tokenId}/${principal}`;
  } else if (type === "NFTGeek") {
    url = `https://t5t44-naaaa-aaaah-qcutq-cai.raw.icp0.io/holder/${principal}/tokenTransactions`;
  } else if (type === "ic-explorer") {
    url = `https://www.icexplorer.io/address/detail/${principal}`;
  }

  return url;
}

export interface UseTransactionExplorerLink {
  isBridgeToken?: boolean;
  snsRootId?: string;
  tokenId: string;
  principal: string;
  type: "dashboard" | "ic-explorer" | "ic-house" | "NFTGeek";
}

export function useTransactionExplorerLink({
  principal,
  tokenId,
  snsRootId,
  isBridgeToken,
  type,
}: UseTransactionExplorerLink) {
  return useMemo(() => {
    if (!principal) return;

    return getTransactionExplorerLink({ principal, tokenId, snsRootId, isBridgeToken, type });
  }, [type, snsRootId, isBridgeToken, tokenId, principal]);
}
