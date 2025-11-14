import { useState, useCallback } from "react";
import { isUndefinedOrNull, principalToAccount } from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { MessageTypes, useTips } from "hooks/index";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { nftTransfer } from "hooks/nft/useNFTCalls";
import { encodeTokenIdentifier, stringToArrayBuffer } from "utils";
import { ResultStatus } from "@icpswap/types";
import { getLocaleMessage } from "i18n/service";
import { NFTSendUI } from "components/Wallet/NFT/NFTSendUI";

export function NFTSend() {
  const { t } = useTranslation();
  const { setPages } = useWalletContext();
  const { setSelectedContact } = useWalletAddressBookContext();
  const { sendingNFTMetadata } = useWalletNFTContext();
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = useCallback(
    async (address: string, memo?: string) => {
      if (isUndefinedOrNull(address) || isUndefinedOrNull(sendingNFTMetadata) || isUndefinedOrNull(principal)) return;

      try {
        setLoading(true);

        const to_address = address.includes("-") ? principalToAccount(address) : address;

        const { status, message } = await nftTransfer(sendingNFTMetadata.cId, {
          from: { address: principalToAccount(principal) },
          to: { address: to_address },
          memo: [...(memo ? stringToArrayBuffer(memo) : stringToArrayBuffer("TRANSFER"))],
          token: encodeTokenIdentifier(sendingNFTMetadata.cId, sendingNFTMetadata.tokenId),
          amount: BigInt(1),
          subaccount: [],
          nonce: [],
          notify: false,
        });

        if (status === ResultStatus.OK) {
          openTip("NFT sent successfully", MessageTypes.success);
          setSelectedContact(undefined);
          setPages(WalletManagerPage.NFTCanister);
        } else {
          openTip(getLocaleMessage(message) ?? t("common.transfer.failed"), MessageTypes.error);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    },
    [setSelectedContact, setLoading, principal, setPages],
  );

  return sendingNFTMetadata ? (
    <NFTSendUI
      loading={loading}
      onSend={handleSend}
      disabled={isUndefinedOrNull(sendingNFTMetadata)}
      name={sendingNFTMetadata.name}
      tokenId={sendingNFTMetadata.tokenId}
    />
  ) : null;
}
